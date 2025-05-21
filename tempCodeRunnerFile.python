
import os

import telebot
import requests
import pickle
import json

# https://smhri.com/oeccrm/api/enquiries/

BOT_TOKEN = os.environ.get('BOT_TOKEN')

TOKEN = "5868277941:AAFEzdZhlae1gMLso5LPj-NHmuH0-TxM_10"

bot = telebot.TeleBot(TOKEN)
    
def get_token(username, password):
    
    endpoint = "https://smhri.com/oeccrm/api/user/login/"

    request = requests.post(endpoint, data={"username":username, "password":password})
    
    if request.status_code == 200:
        return request.json()
    else:
        raise Exception("Failed to get token. Invalid response from the server.")
        
    
    
# USERNAME, PASSWORD = range(2)

# Handler function for the /login command
@bot.message_handler(commands=['login'])
def start(message):
    bot.send_message(message.chat.id, "Hi! I am your bot. Please enter your username.")
    bot.register_next_step_handler(message, receive_username)

# Handler function for receiving the username
def receive_username(message):
    username = message.text
    # Save the username in user_data (you can also use a database for this)
    bot.send_message(message.chat.id, "Thanks! Now, please enter your password.")
    bot.register_next_step_handler(message, receive_password, username)

# Handler function for receiving the password
def receive_password(message, username):
    password = message.text
    # Save the password in user_data (you can also use a database for this)

    
    
    bot.send_message(message.chat.id, f"Username: {username}\nPassword: {password}")
    bot.send_message(message.chat.id, "Logging you please wait.....")
    
    try:
        token = get_token(username, password)

        # Save the token in a file using Pickle
        with open(f'{username}.pkl', 'wb') as file:
            pickle.dump(token, file)

        bot.reply_to(message, "Login Successful!")
    except:

        bot.reply_to(message, "Failed to connect to the server!")
    
    
@bot.message_handler(commands='enquiries')

def show_enquiries():
    # with open()
    headers = {
        'Authorization': 'Bearer ' + authToken,
        'Content-Type': 'application/json'
    }
    url = 'https://www.smhri.com/api/enquiries/'
    # data = 
    # You can perform authentication or any other logic here


bot.infinity_polling()