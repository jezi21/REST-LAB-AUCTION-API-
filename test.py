from datetime import datetime



from datetime import datetime


def str_to_date(date_str:str)->datetime:
    return datetime.strptime(date_str, "%Y-%m-%d %H:%M:%S")


a= str_to_date("2021-01-01 00:00:00") == datetime(2021, 1, 1, 0, 0)
print(a)