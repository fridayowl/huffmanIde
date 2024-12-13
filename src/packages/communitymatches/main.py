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

class Skills(TypedDict):
    primary: List[str]
    secondary: List[str]
    interests: List[str]
    proficiency: Dict[str, int]

class Character(TypedDict):
    type: str
    level: int
    experience: int
    specializations: List[str]
    activeTime: str
    strengths: List[str]

class Preferences(TypedDict):
    collaborationTypes: List[str]
    timeOverlap: int
    mentorshipType: str
    projectTypes: List[str]
    teamSize: int
    communicationStyle: str
    learningGoals: List[str]

class CommunityProfile(TypedDict):
    skills: Skills
    character: Character
    preferences: Preferences

class VertexAICommunityMatcher:
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
            "temperature": 0.7,
            "top_p": 0.8,
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

    def validate_profile(self, profile: CommunityProfile) -> None:
        """Validate the input community profile."""
        # Validate skills
        skills = profile.get('skills', {})
        required_skill_fields = ['primary', 'secondary', 'interests', 'proficiency']
        for field in required_skill_fields:
            if field not in skills:
                raise ValueError(f"Missing skills field: {field}")

        # Validate character
        character = profile.get('character', {})
        required_char_fields = ['type', 'level', 'experience', 'specializations', 'activeTime']
        for field in required_char_fields:
            if field not in character:
                raise ValueError(f"Missing character field: {field}")

        if not 1 <= character['level'] <= 10:
            raise ValueError("Character level must be between 1 and 10")

        # Validate preferences
        preferences = profile.get('preferences', {})
        required_pref_fields = ['collaborationTypes', 'timeOverlap', 'mentorshipType', 
                              'projectTypes', 'teamSize']
        for field in required_pref_fields:
            if field not in preferences:
                raise ValueError(f"Missing preference field: {field}")

    def _generate_basic_matches(self, profile: CommunityProfile) -> Dict[str, Any]:
        """Generate basic matching recommendations without AI."""
        matches = {
            'recommendedMembers': [],
            'potentialProjects': [],
            'learningOpportunities': [],
            'mentorshipMatches': [],
            'collaborationSuggestions': []
        }

        character_type = profile['character']['type']
        if character_type == 'reviewer':
            matches['recommendedMembers'].append({
                'type': 'Developer seeking review',
                'matchScore': 85,
                'reason': 'Matching technical stack'
            })

        # Add basic mentorship matches based on preferences
        if profile['preferences']['mentorshipType'] == 'mentor':
            matches['mentorshipMatches'].append({
                'type': 'Mentee seeking guidance',
                'matchScore': 80,
                'skills': profile['skills']['primary']
            })

        return matches

    def generate_community_matches(self, profile: CommunityProfile) -> Dict[str, Any]:
        """Generate community matches using AI with fallback to basic matching."""
        try:
            prompt = f"""
            Based on the following developer community profile:
            Skills: {json.dumps(profile['skills'], indent=2)}
            Character: {json.dumps(profile['character'], indent=2)}
            Preferences: {json.dumps(profile['preferences'], indent=2)}

            Generate personalized community recommendations in these categories:
            1. Recommended Members (based on character type and skills)
            2. Potential Projects (matching their interests and skills)
            3. Learning Opportunities (based on goals and current level)
            4. Mentorship Matches (considering mentorship preferences)
            5. Collaboration Suggestions (based on work style and availability)

            Format the response as a JSON object with these categories as keys and arrays of matches as values.
            Each match should include a match score (0-100) and detailed reasoning.
            """

            response = self.model.generate_content(
                prompt,
                generation_config=self.generation_config,
                safety_settings=self.safety_settings
            )

            try:
                matches = json.loads(response.text)
            except json.JSONDecodeError:
                logger.error("Failed to parse AI response as JSON")
                matches = self._generate_basic_matches(profile)

            return {
                'matches': matches,
                'timestamp': datetime.utcnow().isoformat(),
                'metadata': {
                    'model': 'gemini-1.5-pro-001',
                    'version': '1.0'
                }
            }

        except Exception as e:
            logger.error(f"Error generating matches: {str(e)}")
            return {
                'matches': self._generate_basic_matches(profile),
                'timestamp': datetime.utcnow().isoformat(),
                'error': str(e)
            }

@functions_framework.http
def generate_community_matches(request):
    """HTTP Cloud Function for generating community matches."""
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

        # Extract profile data
        profile_data = request_json.get('profileData', {})
        if not profile_data:
            return (json.dumps({
                'error': 'Missing profile data'
            }), 400, headers)

        # Initialize matcher
        matcher = VertexAICommunityMatcher()

        try:
            # Validate profile data
            matcher.validate_profile(profile_data)
        except ValueError as ve:
            return (json.dumps({
                'error': 'Validation error',
                'message': str(ve)
            }), 400, headers)

        # Generate matches
        matches = matcher.generate_community_matches(profile_data)
        
        return (json.dumps(matches), 200, headers)

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return (json.dumps({
            'error': 'Internal server error',
            'message': str(e)
        }), 500, headers)