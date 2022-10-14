import json

baseURI_IMAGE = "https://gateway.pinata.cloud/ipfs/QmakNUgFuauffT4xKm9qBaTuQv5jutQW4bzNtWn6QPcLSG/"

def generateMetadata(jsonFolderPath):
    for idx in range(1, 21):
      idxFill = str(idx).zfill(3)
      data = {}
      data['name'] = "20AMIGOS #" + str(idx)
      data['image'] = baseURI_IMAGE + str(idx) + ".png"
      data['description'] = "20AMIGOS TESTING #" + str(idx) 
      data['edition'] = str(idx)
      
      with open(jsonFolderPath + str(idx) +'.json', 'w+', encoding='utf-8') as jsonf:
        jsonf.write(json.dumps(data, indent=4))

filepath = "metadata/generated/"
generateMetadata(filepath)

