## Backend Setup
cd backend
# create a virtual environment - Only Once
python3 -m venv venv
# or venv\Scripts\activate on Windows
# activate virtual environment
source venv/bin/activate
# Note: To exit the virtual environment at any time, just type deactivate
pip install -r requirements.txt
# cd into where manage.py file exists
cd Back 
python manage.py migrate
python manage.py runserver


# how to create an admin user
python manage.py createsuperuser
# log in http://127.0.0.1:8000/admin/
