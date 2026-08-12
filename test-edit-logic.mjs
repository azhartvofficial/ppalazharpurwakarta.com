async function test() {
  const alamatObj = {
    "is_wna": false,
    "provinsi": "JAWA BARAT",
    "kota": "KABUPATEN PURWAKARTA",
    "kecamatan": "PURWAKARTA"
  };

  const provRes = await fetch("https://emsifa.github.io/api-wilayah-indonesia/api/provinces.json");
  const provinces = await provRes.json();

  const provId = provinces.find(p => p.name?.trim().toUpperCase() === alamatObj.provinsi?.trim().toUpperCase())?.id;
  console.log("ProvId:", provId);

  if (provId) {
    const regRes = await fetch(`https://emsifa.github.io/api-wilayah-indonesia/api/regencies/${provId}.json`);
    const regenciesData = await regRes.json();
    const regId = regenciesData.find(r => r.name?.trim().toUpperCase() === alamatObj.kota?.trim().toUpperCase())?.id;
    console.log("RegId:", regId);

    if (regId) {
      const distRes = await fetch(`https://emsifa.github.io/api-wilayah-indonesia/api/districts/${regId}.json`);
      const districtsData = await distRes.json();
      const distId = districtsData.find(d => d.name?.trim().toUpperCase() === alamatObj.kecamatan?.trim().toUpperCase())?.id;
      console.log("DistId:", distId);
    }
  }
}
test();
