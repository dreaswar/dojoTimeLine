
###################################################################
# This code is part of the dojoTimeLine project 
# code at http://github.com/dreaswar/dojoTimeLine
# License: GNU-GPL Version 3 
# Copyright : Dr.Easwar T.R 
####################################################################


# all the imports
import sqlite3

from flask import Flask, request, session, g, redirect, url_for, \
     abort, render_template, flash, jsonify





# configuration
DATABASE   = '/tmp/flask_timeline.db'
DEBUG      = True
SECRET_KEY = 'development key'
USERNAME   = 'admin'
PASSWORD   = 'default'




# create our little application :)
app = Flask(__name__)
app.config.from_object(__name__)




def connect_db():
  return sqlite3.connect(app.config['DATABASE'])



#def init_db():
#    with closing(connect_db()) as db:
#        with app.open_resource('schema.sql') as f:
#            db.cursor().executescript(f.read())
#        db.commit()

@app.before_request
def before_request():
    g.db = connect_db()


@app.teardown_request
def teardown_request(exception):
    g.db.close()




@app.route('/')
def show_entries():
    return render_template('index.html')




@app.route('/dojotimeline/get_events', methods=["GET"])
def get_events():
    from datetime import datetime, date, time
    events = [{'year'      : 2010   , 
               'month'     : 11,
               'day'       : 1,
               'title'      : "First Event" ,
               'description' : 'First Event recorded on this day !! Ye !'
             }]
    return jsonify(year= 2010, month = 12, day=11,title='First Event', description="A new event")



@app.route('/dojotimeline/add_event', methods = ["POST"])
def add_event():

    g.db.execute('insert into timeline_entry (title, description, date) values (?, ?, ?)',
                 [request.form['title'], 
                  request.form['description'], 
                  request.form['date']
                 ]
    )

    g.db.commit()

    return jsonify(success = True, message = "Event Successfully Added")





if __name__ == '__main__':
    app.run()


