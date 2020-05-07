# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License.

from flask import Flask, request, send_from_directory
app = Flask(__name__, static_url_path='')

@app.route('/public/<path:path>')
def static_files(path):
    return send_from_directory('public', path)

@app.route('/api')
def api():
    return 'Hello from webfrontend'

@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)