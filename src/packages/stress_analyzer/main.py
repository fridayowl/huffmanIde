import json
import os
from datetime import datetime
from typing import Dict, Any, List
import functions_framework
import vertexai
from vertexai.generative_models import GenerativeModel, Part, SafetySetting
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class VertexAIStressAnalyzer:
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
            "temperature": 1,
            "top_p": 0.95,
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
            self.model = GenerativeModel("gemini-1.5-flash-002")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini model: {str(e)}")
            raise

    def validate_metrics(self, metrics: Dict[str, Any]) -> None:
        """Validate the input metrics."""
        required_fields = ['typingSpeed', 'errorRate', 'codeComplexity', 
                         'timeWithoutBreaks', 'keystrokes', 'mouseMovement']
        
        missing_fields = [field for field in required_fields if field not in metrics]
        if missing_fields:
            raise ValueError(f"Missing required metrics: {', '.join(missing_fields)}")
        
        validations = {
            'typingSpeed': (0, 200),
            'errorRate': (0, 100),
            'codeComplexity': (0, 100),
            'timeWithoutBreaks': (0, 480),
            'keystrokes': (0, 1000),
            'mouseMovement': (0, 1000)
        }
        
        for field, (min_val, max_val) in validations.items():
            value = metrics.get(field)
            if not isinstance(value, (int, float)):
                raise ValueError(f"Invalid type for {field}: expected number")
            if not min_val <= value <= max_val:
                raise ValueError(f"Invalid value for {field}: must be between {min_val} and {max_val}")

    def _normalize(self, value: float, min_val: float, max_val: float) -> float:
        """Normalize value to range [0,1]."""
        if value < min_val:
            return 0
        if value > max_val:
            return 1
        return (value - min_val) / (max_val - min_val)

    def _calculate_cognitive_load(self, metrics: Dict[str, Any]) -> float:
        """Calculate cognitive load as a fallback."""
        factors = {
            'typingSpeed': self._normalize(metrics.get('typingSpeed', 0), 0, 100),
            'errorRate': self._normalize(metrics.get('errorRate', 0), 0, 50),
            'codeComplexity': self._normalize(metrics.get('codeComplexity', 0), 0, 100)
        }
        return sum(factors.values()) / len(factors) * 100

    def _calculate_physical_strain(self, metrics: Dict[str, Any]) -> float:
        """Calculate physical strain as a fallback."""
        factors = {
            'keystrokes': self._normalize(metrics.get('keystrokes', 0), 0, 500),
            'mouseMovement': self._normalize(metrics.get('mouseMovement', 0), 0, 100),
            'timeWithoutBreaks': self._normalize(metrics.get('timeWithoutBreaks', 0), 0, 120)
        }
        return sum(factors.values()) / len(factors) * 100

    def _identify_contributing_factors(self, metrics: Dict[str, Any]) -> List[str]:
        """Identify contributing factors to stress."""
        factors = []
        if metrics.get('timeWithoutBreaks', 0) > 45:
            factors.append("Extended period without breaks")
        if metrics.get('errorRate', 0) > 10:
            factors.append("High error rate")
        if metrics.get('codeComplexity', 0) > 70:
            factors.append("High code complexity")
        return factors

    def _generate_recommendations(self, stress_level: str, metrics: Dict[str, Any]) -> List[str]:
        """Generate recommendations based on stress level and metrics."""
        recommendations = []
        if stress_level == 'high':
            recommendations.extend([
                "Take an immediate break of at least 15 minutes",
                "Consider switching to a less complex task",
                "Review your ergonomic setup"
            ])
        elif stress_level == 'moderate':
            recommendations.extend([
                "Take a short break in the next 30 minutes",
                "Do some quick stretching exercises",
                "Consider breaking down complex tasks"
            ])
        else:
            recommendations.extend([
                "Maintain current work rhythm",
                "Schedule regular breaks",
                "Monitor stress levels"
            ])
        return recommendations

    def analyze_stress(self, metrics: Dict[str, Any]) -> Dict[str, Any]:
        """Generate analysis of stress patterns."""
        cognitive_load = self._calculate_cognitive_load(metrics)
        physical_strain = self._calculate_physical_strain(metrics)

        # Calculate overall stress score
        stress_score = (cognitive_load + physical_strain) / 2

        # Determine stress level
        if stress_score >= 70:
            stress_level = 'high'
        elif stress_score >= 40:
            stress_level = 'moderate'
        else:
            stress_level = 'low'

        return {
            'stressLevel': stress_level,
            'stressScore': round(stress_score, 2),
            'metrics': {
                'cognitiveLoad': round(cognitive_load, 2),
                'physicalStrain': round(physical_strain, 2),
                'contributingFactors': self._identify_contributing_factors(metrics)
            },
            'recommendations': self._generate_recommendations(stress_level, metrics),
            'timestamp': datetime.utcnow().isoformat()
        }

@functions_framework.http
def analyze_stress(request):
    """HTTP Cloud Function for stress analysis."""
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

        # Extract metrics
        metrics = request_json.get('developerMetrics', {})
        if not metrics:
            return (json.dumps({
                'error': 'Missing developer metrics'
            }), 400, headers)

        # Initialize analyzer
        analyzer = VertexAIStressAnalyzer()

        try:
            # Validate metrics
            analyzer.validate_metrics(metrics)
        except ValueError as ve:
            return (json.dumps({
                'error': 'Validation error',
                'message': str(ve)
            }), 400, headers)

        # Perform analysis
        analysis = analyzer.analyze_stress(metrics)
        
        return (json.dumps(analysis), 200, headers)

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return (json.dumps({
            'error': 'Internal server error',
            'message': str(e)
        }), 500, headers)