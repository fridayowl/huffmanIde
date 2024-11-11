import requests
from bs4 import BeautifulSoup
import re

# Function to find email addresses in the page text using regex
def find_emails(text):
    # Regex pattern for matching email addresses
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    return re.findall(email_pattern, text)

# URL of the GitHub search page
search_url = "https://github.com/search?q=python&type=users&s=&o=desc"

# Set up headers to mimic a browser request
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
}

# Send a GET request to the search URL
response = requests.get(search_url, headers=headers)

# Check if the request was successful
if response.status_code == 200:
    # Parse the page content
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find all divs containing the desired information
    search_title_divs = soup.find_all('div', class_='Box-sc-g0xbh4-0 MHoGG search-title')

    # Check if any divs were found
    if search_title_divs:
        for search_title_div in search_title_divs:
            # Get all <a> tags within each found div
            links = search_title_div.find_all('a')
            
            # Extract href attributes and text from the <a> tags
            for link in links:
                href = link.get('href')
                text = link.get_text(strip=True)
                
                # Create the full URL for the user's GitHub profile
                user_profile_url = f"https://github.com{href}"
                print(f'Checking profile: {user_profile_url}')

                # Send a GET request to the user's GitHub profile
                user_response = requests.get(user_profile_url, headers=headers)

                # Check if the request was successful
                if user_response.status_code == 200:
                    # Parse the user profile page content
                    user_soup = BeautifulSoup(user_response.text, 'html.parser')

                    # Use regex to search for email addresses in the entire page text
                    emails = find_emails(user_soup.get_text())
                    
                    # Display any found email addresses
                    if emails:
                        print(f'Found email(s) for {text}: {", ".join(emails)}')
                    else:
                        print(f'No emails found for {text}.')
                else:
                    print(f'Failed to retrieve the profile page for {text}. Status code: {user_response.status_code}')
    else:
        print("No matching divs found")
else:
    print(f"Failed to retrieve the search page. Status code: {response.status_code}")
