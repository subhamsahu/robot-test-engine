#!/bin/bash

systemctl start mongod
tmux new-session -d -s robo_server \; send-keys "python3.10 server/start-server.py" Enter
tmux new-session -d -s robo_ui \; send-keys "cd ui;npm start" Enter

