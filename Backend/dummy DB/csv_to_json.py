import pandas as pd

df = pd.read_excel('MCA dummy CSV.xlsx')

df['Date of Incorporation'] = pd.to_datetime(df["Date of Incorporation"]).dt.strftime("%d-%m-%Y")

json_data = df.to_json(orient='records', indent=4)

with open('MCA companies.json', 'w') as f:
    f.write(json_data)

print("json Created Ok")