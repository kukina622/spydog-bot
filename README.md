# spydog-bot

## How to setup

1. type your config like .env
2. set your NODE_ENV
3. copy .env to .env.{NODE_ENV}
4. complete your datatable
5. finally,you can use ts-node run it

---

## Game flow

1. Admin use /startGame
2. Random assigning card to players
3. Players will get cards which them be assigned
4. Players can click the button to use card
5. Card will deliver to some channel which environmental variables config
6. Finally, play fun :)

---

## Slash command

### /start_game

- scope: guild
- permissions: admin
- description: It's will start the game, and send assigned cards to player

### /stop_game

- scope: guild
- permissions: admin
- description: stop the game, player can't use card

### /restart_game

- scope: guild
- permissions: admin
- description: restart the game, player can use card

### /import_user

- scope: guild
- permissions: admin
- description: import discord member by role

### /list

- scope: global
- permissions: everyone
- description: Can list what card player have

---

## Description of environmental variables

- BOT_TOKEN: your discord bot token
- CLIENT_ID: your discord bot id
- GUILD_ID: the server which the bot join
- CHANNEL_ID: the player use card will deliver here
- OBSERVER_CHANNEL_ID: the channel will get records of player action and game state

#### The following are database config

- DATABASE_HOST
- DATABASE_PORT
- DATABASE_USERNAME
- DATABASE_PASSWORD
- DATABASE_NAME

---

## Folder structure

### Entities

The typeorm entity and datatable structure are defined there

### Handlers

Discord event commands handler

### Services

Business Logic Layer

### Slashes

Discord slash commands
Example: /poll

### Repositories

Database operate logic

---

## Datatable

### users

players information

|   uid   |    name    |  discord_id  | is_spy  |    team     |
| :-----: | :--------: | :----------: | :-----: | :---------: |
| PRIMARY | mediumtext | varchar(255) | boolean | varchar(10) |

### cards

cards information

|   cid   | card_name  |  card_url  | hidden_use |      type       |
| :-----: | :--------: | :--------: | :--------: | :-------------: |
| PRIMARY | mediumtext | mediumtext |  boolean   | enum `cardType` |

### assigned_card

the cards are assigned to user

| assign_id |       uid       |       cid       | is_used | usage_time |
| :-------: | :-------------: | :-------------: | :-----: | :--------: |
|  PRIMARY  | FK from `users` | FK from `cards` | boolean |  DateTime  |

### game_state

the game state

|    state     | description |
| :----------: | :---------: |
| enum `State` | varchar(20) |
