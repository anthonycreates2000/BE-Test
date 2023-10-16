const axios = require("axios");
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");

const Redis = require("ioredis");
const redis = new Redis();

COUNT_DESTINATION_COUNTRY = "count_destination_country";
COUNT_SOURCE_COUNTRY = "count_source_country";

describe("Tes fungsi getData", () => {
  afterEach(() => {
    sinon.restore();
  });
  it("Mendapatkan data dari livethreat API", async () => {
    const {
      getLivethreatDataFromAPI,
    } = require("../__tests__/../../app/controllers/exampleController");

    const live_threat_queries = await getLivethreatDataFromAPI();

    // Mengecek apabila data yang diberikan kosong atau tidak.
    expect(live_threat_queries.length).greaterThan(0);

    // Mengecek key-key yang diberikan dari array tersebut.
    const expected_keys = [
      "sourceCountry",
      "destinationCountry",
      "millisecond",
      "type",
      "weight",
      "attackTime",
    ];
    let first_element_livethreat = live_threat_queries[0][0];
    let livethreat_keys = Object.keys(first_element_livethreat);
    console.log(livethreat_keys);
    expect(livethreat_keys).to.deep.equal(expected_keys);
  });

  it("Mendapatkan data dari redis cache apabila tersedia", async () => {
      const {
        getLivethreatRedisCache,
        getLivethreatDataFromAPI,
        save_livethreat_to_redis,
      } = require("../__tests__/../../app/controllers/exampleController");

      let result = await getLivethreatRedisCache(
        COUNT_DESTINATION_COUNTRY,
        COUNT_SOURCE_COUNTRY
      );

      // Mengecek apabila data yang diberikan kosong apabila belum dimasukkan data sama sekali (hanya running perintah diatas sekali).
      // CATATAN: Harus menjalankan FLUSHALL terlebih dahulu di redis-cli, agar data di redis sudah kosong.
      expect(result).to.be.null;

      // Setelah mengecek apabila data tersebut kosong, maka saya akan mencoba untuk running kembali.
      // .
      const live_threat_queries = await getLivethreatDataFromAPI();
      await save_livethreat_to_redis(live_threat_queries);

      result = await getLivethreatRedisCache(
        COUNT_DESTINATION_COUNTRY,
        COUNT_SOURCE_COUNTRY
      );

      // Mengecek apabila terdapat data pada redis apabila telah disimpan setidaknya sekali.
      expect(result).not.to.be.null;
  });
})