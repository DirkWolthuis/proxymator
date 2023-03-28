# Proxymator

[https://proxymator.netlify.app](https://proxymator.netlify.app)

[![Netlify Status](https://api.netlify.com/api/v1/badges/74d88c4e-f9f2-46b7-b430-3c38a4f177ed/deploy-status)](https://app.netlify.com/sites/proxymator/deploys)

```
JSON.stringify([...document.querySelectorAll(".contentColorInv")]
.map(x => x.text)
.filter(x =>x)
.map(x => ({name: x, unit_group_id: 27}))
).replaceAll("\"name\"", "name")
.replaceAll("\"unit_group_id\"", "unit_group_id")
```
