import json
import os
from datetime import datetime
from typing import Dict, Any, List, TypedDict
import functions_framework
import vertexai
from vertexai.generative_models import GenerativeModel, Part, SafetySetting
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class WorkPatterns(TypedDict):
    averageDailyHours: float
    breaksFrequency: int
    nightWorkFrequency: int
    weekendWorkHours: float
    longestStretch: float

class HealthRisks(TypedDict):
    eyeStrain: int
    repetitiveStrain: int
    stressLevel: int
    sleepQuality: int
    posturalIssues: int

class Preferences(TypedDict):
    exerciseType: List[str]
    timePreference: str
    intensityPreference: str
    existingConditions: List[str]
    dietaryRestrictions: List[str]

class HealthData(TypedDict):
    workPatterns: WorkPatterns
    healthRisks: HealthRisks
    preferences: Preferences

class VertexAIHealthRecommender:
    def __init__(self):
        try:
            # Initialize Vertex AI
            vertexai.init(
                project="fine-mile-444406-h9",
                location="us-central1"
            )
        except Exception as e:
            logger.error(f"Failed to initialize Vertex AI: {str(e)}")
            raise

        self.generation_config = {
            "max_output_tokens": 8192,
            "temperature": 0.8,
            "top_p": 0.9,
        }

        self.safety_settings = [
            SafetySetting(
                category=SafetySetting.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold=SafetySetting.HarmBlockThreshold.OFF
            ),
            SafetySetting(
                category=SafetySetting.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold=SafetySetting.HarmBlockThreshold.OFF
            ),
            SafetySetting(
                category=SafetySetting.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold=SafetySetting.HarmBlockThreshold.OFF
            ),
            SafetySetting(
                category=SafetySetting.HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold=SafetySetting.HarmBlockThreshold.OFF
            ),
        ]

        try:
            self.model = GenerativeModel("gemini-1.5-pro-001")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini model: {str(e)}")
            raise

    def validate_health_data(self, health_data: HealthData) -> None:
        """Validate the input health data."""
        # Validate work patterns
        work_patterns = health_data.get('workPatterns', {})
        work_pattern_validations = {
            'averageDailyHours': (0, 24),
            'breaksFrequency': (0, 60),
            'nightWorkFrequency': (0, 7),
            'weekendWorkHours': (0, 48),
            'longestStretch': (0, 24)
        }
        
        for field, (min_val, max_val) in work_pattern_validations.items():
            value = work_patterns.get(field)
            if value is None:
                raise ValueError(f"Missing work pattern: {field}")
            if not isinstance(value, (int, float)):
                raise ValueError(f"Invalid type for {field}: expected number")
            if not min_val <= value <= max_val:
                raise ValueError(f"Invalid {field}: must be between {min_val} and {max_val}")

        # Validate health risks
        health_risks = health_data.get('healthRisks', {})
        required_risks = ['eyeStrain', 'repetitiveStrain', 'stressLevel', 'sleepQuality', 'posturalIssues']
        
        for risk in required_risks:
            value = health_risks.get(risk)
            if value is None:
                raise ValueError(f"Missing health risk: {risk}")
            if not isinstance(value, (int, float)):
                raise ValueError(f"Invalid type for {risk}: expected number")
            if not 0 <= value <= 100:
                raise ValueError(f"Invalid {risk}: must be between 0 and 100")

        # Validate preferences
        preferences = health_data.get('preferences', {})
        required_preferences = ['exerciseType', 'timePreference', 'intensityPreference', 
                              'existingConditions', 'dietaryRestrictions']
        
        for pref in required_preferences:
            if pref not in preferences:
                raise ValueError(f"Missing preference: {pref}")

    def _generate_recommendations(self, health_data: HealthData) -> Dict[str, Any]:
        """Generate basic recommendations without AI when needed."""
        recommendations = {
            'immediateActions': [],
            'longTermStrategies': [],
            'exerciseRecommendations': [],
            'ergonomicAdjustments': [],
            'lifestyleModifications': []
        }
        
        # Add recommendations based on health risks
        risks = health_data['healthRisks']
        if risks['eyeStrain'] > 70:
            recommendations['immediateActions'].append('Take an immediate eye break using 20-20-20 rule')
            recommendations['ergonomicAdjustments'].append('Adjust monitor brightness and position')
        
        if risks['stressLevel'] > 70:
            recommendations['immediateActions'].append('Take a 15-minute relaxation break')
            recommendations['lifestyleModifications'].append('Implement regular stress management techniques')
        
        if risks['repetitiveStrain'] > 70:
            recommendations['immediateActions'].append('Perform immediate stretching exercises')
            recommendations['ergonomicAdjustments'].append('Review keyboard and mouse positioning')

        # Add exercise recommendations based on preferences
        exercise_types = health_data['preferences']['exerciseType']
        time_pref = health_data['preferences']['timePreference']
        
        for exercise in exercise_types:
            recommendations['exerciseRecommendations'].append(
                f'Schedule {exercise} sessions during {time_pref} hours'
            )

        return recommendations

    def generate_health_recommendations(self, health_data: HealthData) -> Dict[str, Any]:
        """Generate recommendations using AI with fallback to basic recommendations."""
        try:
            prompt = f"""
            Based on the following developer health data:
            Work Patterns: {json.dumps(health_data['workPatterns'], indent=2)}
            Health Risks: {json.dumps(health_data['healthRisks'], indent=2)}
            Preferences: {json.dumps(health_data['preferences'], indent=2)}

            Generate personalized health recommendations in the following categories:
            1. Immediate Actions
            2. Long-term Health Strategies
            3. Exercise Recommendations
            4. Ergonomic Adjustments
            5. Lifestyle Modifications

            Format the response as a JSON object with these categories as keys and arrays of recommendations as values.
            """

            response = self.model.generate_content(
                prompt,
                generation_config=self.generation_config,
                safety_settings=self.safety_settings
            )

            try:
                recommendations = json.loads(response.text)
            except json.JSONDecodeError:
                logger.error("Failed to parse AI response as JSON")
                recommendations = self._generate_recommendations(health_data)

            return {
                'recommendations': recommendations,
                'timestamp': datetime.utcnow().isoformat(),
                'metadata': {
                    'model': 'gemini-1.5-pro-001',
                    'version': '1.0'
                }
            }

        except Exception as e:
            logger.error(f"Error generating recommendations: {str(e)}")
            return {
                'recommendations': self._generate_recommendations(health_data),
                'timestamp': datetime.utcnow().isoformat(),
                'error': str(e)
            }

@functions_framework.http
def generate_health_recommendations(request):
    """HTTP Cloud Function for generating health recommendations."""
    try:
        # Set CORS headers for the preflight request
        if request.method == 'OPTIONS':
            headers = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '3600'
            }
            return ('', 204, headers)

        # Set CORS headers for the main request
        headers = {
            'Access-Control-Allow-Origin': '*'
        }

        # Get request JSON
        request_json = request.get_json(silent=True)
        if not request_json:
            return (json.dumps({
                'error': 'No JSON data provided'
            }), 400, headers)

        # Extract health data
        health_data = request_json.get('healthData', {})
        if not health_data:
            return (json.dumps({
                'error': 'Missing health data'
            }), 400, headers)

        # Initialize recommender
        recommender = VertexAIHealthRecommender()

        try:
            # Validate health data
            recommender.validate_health_data(health_data)
        except ValueError as ve:
            return (json.dumps({
                'error': 'Validation error',
                'message': str(ve)
            }), 400, headers)

        # Generate recommendations
        recommendations = recommender.generate_health_recommendations(health_data)
        
        return (json.dumps(recommendations), 200, headers)

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return (json.dumps({
            'error': 'Internal server error',
            'message': str(e)
        }), 500, headers)