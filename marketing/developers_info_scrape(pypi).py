import requests
from bs4 import BeautifulSoup
import re
import csv
import time

# URL of the PyPI search page
search_url = 'https://pypi.org/search/?q=&o=&c=Intended+Audience+%3A%3A+Other+Audience'

# Regular expression to match email addresses and GitHub links
email_regex = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
github_regex = r'https?://github\.com/[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+'

# Prepare to write to CSV
with open('pypi_packages.csv', 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ['Package', 'Author', 'Maintainers', 'Released', 'Emails', 'GitHub Links', 'Package URL']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    
    # Write the header
    writer.writeheader()

    for page in range(1, 501):  # Loop for 500 pages
        # Send a request to the search page with pagination
        response = requests.get(f'{search_url}&page={page}')
        soup = BeautifulSoup(response.text, 'html.parser')

        # Find all package snippets on the search results page
        packages = soup.find_all('h3', class_='package-snippet__title')

        # Loop through each package snippet to get the name, visit each package's page, and scrape details
        for package in packages:
            # Extract the package name
            package_name = package.find('span', class_='package-snippet__name').text
            package_url = f'https://pypi.org/project/{package_name}/'

            # Visit the package's individual page
            package_response = requests.get(package_url)
            package_soup = BeautifulSoup(package_response.text, 'html.parser')

            # Extract Author Name
            author_name = None
            author_span = package_soup.find('span', text='Author:')
            if author_span:
                author_name = author_span.find_next_sibling('strong').text

            # Extract Maintainers
            maintainers = []
            maintainers_section = package_soup.find('h6', text='Maintainers')
            if maintainers_section:
                maintainer_elements = maintainers_section.find_next_siblings('span', class_='sidebar-section__maintainer')
                for maintainer in maintainer_elements:
                    maintainer_name = maintainer.find('span', class_='sidebar-section__user-gravatar-text').text.strip()
                    maintainers.append(maintainer_name)

            # Extract Release Date
            release_date = None
            release_info = package_soup.find('span', class_='package-header__date')
            if release_info:
                release_date = release_info.text.strip()

            # Search for email addresses on the package page
            emails = re.findall(email_regex, package_soup.text)
            emails_found = ', '.join(set(emails)) if emails else 'Not found'

            # Search for GitHub links
            github_links = re.findall(github_regex, package_soup.text)
            github_links_found = ', '.join(set(github_links)) if github_links else 'Not found'

            # Write the data to the CSV file
            writer.writerow({
                'Package': package_name,
                'Author': author_name if author_name else 'Not found',
                'Maintainers': ', '.join(maintainers) if maintainers else 'Not found',
                'Released': release_date if release_date else 'Not found',
                'Emails': emails_found,
                'GitHub Links': github_links_found,
                'Package URL': package_url  # Add the package URL
            })

        print(f"Page {page} data has been processed.")
        
        # Delay of 2 seconds
        time.sleep(2)

print("Data has been saved to pypi_packages.csv.")
