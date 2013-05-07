
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
DATABASE   = './flask_timeline.db'
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

    print g.db
    cur        = g.db.execute('SELECT * FROM timeline_entry')
    print cur
    yr_mon_day_map = {}
    all_events  = []

    for row in cur.fetchall():

      print row
      e_yr  = int( row[3].split('-')[0].strip() )
      e_mon = int( row[3].split('-')[1].strip() )
      e_d   = int( row[3].split('-')[2].strip() )

      if not e_yr in yr_mon_day_map.keys():
        yr_mon_day_map[e_yr] = {e_mon:[]}
        mon_dict             = yr_mon_day_map[e_yr]
        day_list             = mon_dict[e_mon]
        day_list.append(e_d)
      else:
        mon_dict = yr_mon_day_map[e_yr]
        if e_mon in mon_dict.keys():
          day_list = mon_dict[e_mon]
          day_list.append(e_d)
          print "Day List is: "
          print day_list
        else:
          mon_dict[e_mon] = [e_d]
    
      event = dict(title       = row[1].strip(), 
                   description = row[2].strip(), 
                   event_date  = row[3].replace(' ',''), 
                   event_year  = int( row[3].split('-')[0].strip() ), 
                   event_month = int( row[3].split('-')[1].strip() ),
                   event_day   = int( row[3].split('-')[2].strip() )
                  );
      print event
      all_events.append(event)

    print yr_mon_day_map
    jsonlist =  dict(all_events = all_events)
    print jsonlist
    return jsonify(all_events = all_events)



@app.route('/dojotimeline/add_event', methods = ["POST"])
def add_event():

    g.db.execute('insert into timeline_entry(title, description, event_date) values (?, ?, ?)',
                 [request.form['title'], 
                  request.form['description'], 
                  request.form['event_date']
                 ]
    )

    g.db.commit()

    return jsonify(success = True, message = "Event Successfully Added")





if __name__ == '__main__':
    app.run()


