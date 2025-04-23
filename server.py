from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from datetime import datetime
from io import StringIO

app = Flask(__name__)
CORS(app)

# Raw tab-separated data
data_text = """datetime\tLevel
01/01/2025\t1626.32
01/01/2025\t1626.09
01/01/2025\t1625.86
01/01/2025\t1625.62
01/01/2025\t1625.39
01/01/2025\t1625.17
01/01/2025\t1624.95
01/01/2025\t1624.72
01/01/2025\t1624.46
01/01/2025\t1624.2
01/01/2025\t1623.93
01/01/2025\t1623.63
01/01/2025\t1623.303
14/01/2025\t1622.977
15/01/2025\t1622.65
16/01/2025\t1622.323
17/01/2025\t1621.997
18/01/2025\t1621.67
19/01/2025\t1621.317
20/01/2025\t1620.963
21/01/2025\t1620.61
22/01/2025\t1620.257
23/01/2025\t1619.903
24/01/2025\t1619.55
25/01/2025\t1619.185
26/01/2025\t1618.82
27/01/2025\t1618.455
28/01/2025\t1618.09
29/01/2025\t1617.747
30/01/2025\t1617.403
31/01/2025\t1617.06
01/02/2025\t1616.72
02/02/2025\t1616.407
03/02/2025\t1616.093
04/02/2025\t1615.78
05/02/2025\t1615.51
06/02/2025\t1615.24
07/02/2025\t1614.97
08/02/2025\t1614.7
09/02/2025\t1614.425
10/02/2025\t1614.15
11/02/2025\t1613.875
12/02/2025\t1613.6
13/02/2025\t1613.263
14/02/2025\t1612.925
15/02/2025\t1612.588
16/02/2025\t1612.25
17/02/2025\t1611.853
18/02/2025\t1611.455
19/02/2025\t1611.058
20/02/2025\t1610.66
21/02/2025\t1610.265
22/02/2025\t1609.87
23/02/2025\t1609.475
24/02/2025\t1609.08
25/02/2025\t1608.715
26/02/2025\t1608.35
27/02/2025\t1607.985
28/02/2025\t1607.62
01/03/2025\t1607.26
02/03/2025\t1606.887
03/03/2025\t1606.513
04/03/2025\t1606.14
05/03/2025\t1605.638
06/03/2025\t1605.135
07/03/2025\t1604.633
08/03/2025\t1604.13
09/03/2025\t1603.52
10/03/2025\t1602.91
11/03/2025\t1602.3
12/03/2025\t1601.69
13/03/2025\t1601.383
14/03/2025\t1601.075
15/03/2025\t1600.768
16/03/2025\t1600.46
17/03/2025\t1599.743
18/03/2025\t1599.025
19/03/2025\t1598.308
20/03/2025\t1597.59
21/03/2025\t1597.09
22/03/2025\t1596.59
23/03/2025\t1596.09
24/03/2025\t1595.59
25/03/2025\t1595.045
26/03/2025\t1594.5
27/03/2025\t1593.955
28/03/2025\t1593.41
29/03/2025\t1592.64
30/03/2025\t1591.87
31/03/2025\t1591.1
01/04/2025\t1590
02/04/2025\t1588.887
03/04/2025\t1587.773
04/04/2025\t1586.66
05/04/2025\t1586.24
06/04/2025\t1585.82
07/04/2025\t1585.4
08/04/2025\t1584.98
09/04/2025\t1585.015
10/04/2025\t1585.05
11/04/2025\t1585.085
12/04/2025\t1585.12
13/04/2025\t1584.87
14/04/2025\t1584.62
15/04/2025\t1584.37
16/04/2025\t1584.12"""

# Load data
df = pd.read_csv(StringIO(data_text), sep="\t")
df['datetime'] = pd.to_datetime(df['datetime'], dayfirst=True)
df = df.sort_values('datetime')
df['day'] = (df['datetime'] - df['datetime'].min()).dt.days

# Model training
X = df[['day']]
y = df['Level']
poly = PolynomialFeatures(degree=3)
X_poly = poly.fit_transform(X)
model = LinearRegression()
model.fit(X_poly, y)

@app.route("/predict", methods=["POST"])
def predict_level():
    try:
        data = request.get_json()
        date_str = data.get("date")

        if not date_str:
            return jsonify({"error": "Missing date"}), 400

        target_date = datetime.strptime(date_str, "%Y-%m-%d")
        delta_days = (target_date - df['datetime'].min()).days

        if delta_days < 0:
            return jsonify({"error": "Date must be after start date"}), 400

        X_future = poly.transform([[delta_days]])
        prediction = model.predict(X_future)[0]

        return jsonify({
            "date": date_str,
            "predicted_level": round(prediction, 2)
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
