import pandas as pd
import json as json
from pandas.io.json import json_normalize
from flask import Flask, jsonify
import os

filepath = os.path.join("resources", "cause_of_death.json")
with open(filepath) as jsonfile:
    CODjson = json.load(jsonfile)

CODdata = CODjson['data']
COD_df = pd.DataFrame(CODdata)

sid = COD_df[0]
cod_id = COD_df[1]
position = COD_df[2]
created_at = COD_df[3]
updated_at = COD_df[5]
year = COD_df[8]
exp_cause_name = COD_df[9]
cause_name = COD_df[10]
state = COD_df[11]
deaths = COD_df[12]
Age_Adj_DR = COD_df[13]

CODall_df = pd.DataFrame({"sid":sid,
                            "id":cod_id,
                            "position":position,
                            "created_at":created_at,
                            "updated_at":updated_at,
                            "year":year,
                            "113 Cause Name": exp_cause_name,
                            "Cause Name": cause_name,
                            "state": state,
                            "deaths": deaths,
                            "Age-adjusted Death Rate": Age_Adj_DR,})

CODfilt = pd.DataFrame({"year":year,
                        # "113 Cause Name": exp_cause_name,
                        "Cause Name": cause_name,
                        "state": state,
                        "deaths": deaths,
                        # "Age-adjusted Death Rate": Age_Adj_DR,
                        })

#'list' removes indexing. Remove 'list' to add indexing
codDict = CODfilt.to_dict('list')

app = Flask(__name__)

@app.route("/api/v1.0/causa-mortis")
def causaMortis():
    """Return the CoD data as json"""

    return jsonify(codDict)

@app.route("/")
def welcome():
    return(
        f"Abandon hope, all ye who enter this API<br/>"
        f"Available Routes:<br/>"
        f"/api/v1.0/causa-mortis"
    )
if __name__ == "__main__":
    app.run(debug=True)

#Ends
