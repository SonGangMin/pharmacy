import React, { useEffect } from "react";
import $ from "jquery";

function PharmacyMap() {
  useEffect(() => {
    async function getLocation() {
      const XY = {};
      if (navigator.geolocation) {
        let position = await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition((pos) => {
            resolve(pos);
          });
        });
        XY.lat = position.coords.latitude;
        XY.lng = position.coords.longitude;
        return XY;
      }
    }

    async function fetchData() {
      let XY = await getLocation();

      // Naver Maps API 스크립트가 로드되었는지 확인 후 사용
      if (window.naver && window.naver.maps) {
        window.naver.maps.Service.reverseGeocode(
          {
            location: new window.naver.maps.LatLng(XY.lat, XY.lng),
          },
          function (status, response) {
            let result = response.result;
            let items = result.items;
            let sido_arr = items[0].addrdetail.sido.split(" ");
            let gugun_arr = items[0].addrdetail.sigugun.split(" ");

            let sido = "";
            let gugun = "";
            if (sido_arr.length === 1) {
              sido = sido_arr[0];
              gugun = gugun_arr[0];
            } else if (sido_arr.length > 1) {
              sido = sido_arr[0];
              gugun = gugun_arr[1];
            }

            // Axios로 데이터 가져오기
            const apiUrl =
              "http://apis.data.go.kr/B552657/ErmctInsttInfoInqireService/getParmacyListInfoInqire";
            $.ajax({
              url: apiUrl,
              type: "GET",
              cache: false,
              dataType: "json",
              data: {
                serviceKey:
                  "pgiyBKl24omVoSPYn1XpeUS4ZKJdwlRx56dSac9Vn0exH9nhJ/48hsbjnGVFZdNtzb0lGSc5x8Vq03wTJBTkUA==",
                Q0: sido,
                Q1: gugun,
                QT: "",
                QN: "",
                ORD: "",
                pageNo: "1",
                numOfRows: "1000",
              },
              success: function (data) {
                var mapDiv = document.getElementById("map");
                var mapOptions = {
                  center: new window.naver.maps.LatLng(XY.lat, XY.lng),
                  zoom: 14,
                };
                var map = new window.naver.maps.Map(mapDiv, mapOptions);

                data.response.body.items.item.forEach(function (it, index) {
                  let dutyName = it.dutyName;
                  let dutyAddr = it.dutyAddr;
                  let dutyTel1 = it.dutyTel1;
                  let dutyTime = "";

                  // ... dutyTime 설정

                  let pharmacy_location = new window.naver.maps.LatLng(
                    it.wgs84Lat,
                    it.wgs84Lon
                  );
                  let marker = new window.naver.maps.Marker({
                    map: map,
                    position: pharmacy_location,
                  });

                  var contentString = [
                    '<div class="iw_inner">',
                    "   <h3>" + dutyName + "</h3>",
                    "   <p>" + dutyAddr + "<br />",
                    "       " + dutyTel1 + "<br />",
                    "       " + dutyTime,
                    "   </p>",
                    "</div>",
                  ].join("");

                  var infowindow = new window.naver.maps.InfoWindow({
                    content: contentString,
                    maxWidth: 440,
                    backgroundColor: "#eee",
                    borderColor: "#2db400",
                    borderWidth: 5,
                    anchorSize: new window.naver.maps.Size(30, 30),
                    anchorSkew: true,
                    anchorColor: "#eee",
                    pixelOffset: new window.naver.maps.Point(20, -20),
                  });

                  window.naver.maps.Event.addListener(
                    marker,
                    "click",
                    function (e) {
                      if (infowindow.getMap()) {
                        infowindow.close();
                      } else {
                        infowindow.open(map, marker);
                      }
                    }
                  );
                });
              },
              error: function (request, status, error) {},
            });
          }
        );
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <div
        style={{ marginTop: "20px", marginBottom: "10px", fontWeight: "bold" }}
      >
        <h1>약국지도</h1>
      </div>
      <div id="map" style={{ width: "100%", height: "600px" }}></div>
    </div>
  );
}

export default PharmacyMap;
