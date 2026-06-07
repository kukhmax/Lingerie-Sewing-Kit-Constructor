import React, { useState } from 'react';
import BraOutlines from './BraOutlines';

// LARGE ORGANIC PATH CONSTANTS START
const LEFT_LOWER_CUP = "M 710.0,1212.5 L 710.6,1218.2 L 712.1,1224.6 L 715.1,1227.0 L 718.5,1218.3 L 722.8,1215.4 L 724.9,1229.6 L 725.2,1242.1 L 728.0,1243.5 L 730.8,1245.0 L 730.6,1261.2 L 730.8,1278.8 L 734.1,1281.6 L 737.0,1283.1 L 737.0,1294.0 L 737.0,1304.9 L 740.0,1306.5 L 743.0,1315.8 L 746.0,1326.5 L 749.0,1335.7 L 752.5,1344.2 L 756.1,1346.3 L 755.4,1353.0 L 754.8,1359.7 L 758.4,1362.5 L 762.0,1369.6 L 765.0,1375.5 L 768.0,1381.5 L 770.8,1387.7 L 774.5,1394.7 L 777.5,1400.5 L 781.0,1406.7 L 785.9,1415.1 L 791.7,1420.0 L 794.0,1427.2 L 796.5,1431.6 L 799.5,1435.1 L 803.0,1438.5 L 806.4,1441.8 L 809.4,1444.8 L 812.4,1450.8 L 815.4,1456.8 L 818.5,1459.9 L 820.1,1462.0 L 834.0,1475.0 L 847.9,1488.0 L 850.5,1491.0 L 853.0,1494.0 L 857.8,1497.7 L 876.7,1513.3 L 887.8,1522.2 L 895.2,1525.5 L 900.4,1528.5 L 904.0,1532.0 L 908.1,1535.1 L 913.0,1538.0 L 919.1,1542.1 L 925.0,1544.7 L 932.4,1548.1 L 938.3,1550.8 L 944.5,1554.1 L 950.5,1557.0 L 956.9,1559.9 L 966.0,1563.2 L 975.9,1566.4 L 983.8,1570.0 L 995.0,1574.5 L 1003.7,1576.2 L 1017.9,1580.1 L 1025.5,1584.8 L 1021.2,1590.9 L 1013.2,1594.4 L 1001.9,1596.6 L 1001.8,1599.6 L 1007.2,1601.0 L 1015.5,1605.2 L 1013.3,1614.5 L 1006.3,1612.4 L 1000.5,1609.5 L 988.2,1609.2 L 975.8,1605.8 L 962.4,1602.2 L 949.9,1598.9 L 937.5,1596.0 L 927.1,1596.0 L 925.6,1593.1 L 918.6,1589.7 L 908.6,1586.5 L 896.5,1583.3 L 887.8,1580.6 L 874.3,1577.0 L 862.8,1574.2 L 854.0,1571.2 L 843.3,1567.5 L 832.8,1564.0 L 822.6,1561.5 L 805.8,1557.7 L 795.6,1554.7 L 778.9,1551.4 L 770.0,1552.1 L 768.9,1549.3 L 757.7,1545.1 L 747.0,1542.1 L 744.1,1539.0 L 732.2,1539.0 L 720.4,1539.0 L 718.2,1536.0 L 715.9,1533.0 L 705.0,1533.0 L 694.1,1533.0 L 692.8,1530.2 L 682.8,1527.0 L 672.6,1519.9 L 676.8,1513.3 L 677.6,1509.4 L 673.9,1505.4 L 667.5,1504.2 L 662.5,1506.8 L 661.5,1513.9 L 667.0,1517.0 L 662.5,1519.6 L 642.2,1517.7 L 636.5,1514.4 L 631.7,1512.2 L 631.6,1508.8 L 640.2,1507.0 L 649.0,1506.0 L 648.9,1501.3 L 647.5,1495.2 L 646.1,1482.1 L 642.3,1481.6 L 640.6,1487.5 L 643.0,1493.4 L 636.8,1500.4 L 629.8,1381.0 L 634.3,1261.5 L 643.6,1260.7 L 650.9,1255.5 L 653.5,1251.4 L 648.9,1250.0 L 644.5,1248.3 L 645.0,1244.8 L 648.5,1243.0 L 651.4,1241.1 L 662.3,1243.3 L 667.0,1247.0 L 673.8,1243.2 L 678.5,1239.0 L 673.9,1236.8 L 668.0,1235.5 L 671.1,1230.6 L 674.0,1227.0 L 679.6,1224.8 L 686.7,1230.0 L 687.8,1233.9 L 707.0,1222.2 L 701.9,1219.0 L 698.8,1221.7 L 695.1,1224.8 L 687.0,1221.6 L 694.6,1218.0 L 699.0,1216.1 L 710.0,1212.5 Z";
const RIGHT_LOWER_CUP = "M 2213.7,1215.0 L 2219.6,1218.0 L 2226.4,1223.2 L 2231.9,1225.0 L 2238.4,1227.9 L 2243.7,1231.5 L 2250.2,1234.8 L 2257.5,1237.1 L 2262.9,1239.2 L 2270.5,1243.8 L 2274.9,1248.2 L 2265.4,1250.0 L 2257.2,1252.2 L 2261.5,1256.0 L 2269.1,1260.2 L 2283.0,1256.0 L 2286.9,1250.9 L 2289.1,1370.0 L 2286.8,1499.7 L 2284.1,1499.8 L 2282.8,1488.8 L 2283.3,1478.9 L 2279.0,1474.9 L 2273.2,1471.2 L 2269.8,1476.8 L 2268.6,1489.2 L 2262.5,1498.7 L 2261.0,1501.7 L 2261.7,1508.5 L 2257.5,1506.7 L 2254.6,1503.1 L 2251.7,1505.6 L 2246.7,1508.0 L 2240.6,1509.1 L 2236.7,1510.2 L 2239.1,1512.6 L 2244.9,1514.0 L 2250.9,1513.6 L 2257.4,1512.6 L 2262.2,1513.6 L 2257.4,1519.8 L 2251.0,1523.1 L 2248.4,1526.2 L 2235.8,1526.3 L 2223.3,1526.5 L 2220.2,1529.8 L 2212.1,1532.4 L 2196.4,1536.1 L 2185.5,1539.0 L 2169.2,1542.0 L 2167.5,1545.0 L 2156.7,1545.0 L 2145.9,1545.0 L 2144.2,1548.0 L 2142.5,1551.0 L 2132.5,1551.0 L 2118.6,1555.1 L 2106.8,1557.8 L 2094.0,1561.0 L 2084.7,1564.0 L 2075.1,1562.3 L 2074.5,1559.3 L 2080.4,1558.0 L 2086.9,1552.8 L 2079.2,1551.5 L 2069.2,1553.2 L 2066.0,1554.2 L 2068.5,1557.2 L 2070.4,1563.4 L 2059.4,1570.0 L 2049.7,1572.7 L 2041.5,1577.0 L 2027.5,1572.4 L 2016.2,1570.6 L 2018.3,1576.6 L 2024.4,1581.7 L 2015.0,1582.8 L 2007.5,1582.5 L 2006.1,1585.7 L 2000.0,1589.0 L 1997.8,1582.0 L 2002.5,1579.9 L 1999.6,1578.3 L 1984.0,1581.8 L 1978.2,1585.6 L 1980.4,1588.3 L 1980.7,1594.5 L 1973.4,1595.1 L 1965.0,1590.9 L 1961.1,1589.0 L 1956.2,1582.2 L 1963.9,1576.3 L 1971.8,1572.7 L 1977.3,1569.5 L 1975.9,1564.7 L 1968.5,1567.5 L 1963.7,1569.2 L 1963.5,1559.0 L 1969.0,1557.3 L 1975.0,1554.3 L 1981.2,1551.2 L 1986.8,1547.7 L 1992.2,1545.0 L 2000.0,1540.4 L 2007.5,1537.8 L 2011.5,1535.2 L 2014.2,1532.4 L 2017.9,1529.1 L 2024.1,1525.7 L 2030.4,1523.1 L 2039.3,1514.5 L 2049.8,1506.8 L 2056.1,1503.1 L 2060.0,1499.3 L 2069.8,1489.8 L 2082.8,1476.8 L 2099.8,1456.5 L 2103.2,1451.2 L 2106.5,1448.0 L 2110.0,1444.5 L 2113.5,1441.1 L 2116.5,1437.6 L 2119.0,1431.4 L 2120.8,1426.3 L 2127.2,1421.1 L 2132.0,1412.8 L 2135.0,1407.0 L 2138.0,1401.0 L 2141.0,1395.0 L 2144.9,1389.4 L 2148.4,1382.9 L 2151.0,1378.7 L 2154.0,1373.1 L 2157.0,1363.9 L 2160.0,1357.0 L 2163.0,1351.0 L 2166.1,1343.5 L 2169.8,1331.5 L 2173.1,1320.0 L 2176.0,1309.0 L 2178.3,1299.9 L 2182.0,1285.7 L 2183.9,1273.1 L 2188.0,1250.0 L 2190.5,1230.6 L 2193.0,1225.9 L 2197.5,1219.0 L 2201.0,1225.8 L 2206.1,1230.5 L 2219.7,1233.6 L 2230.3,1235.4 L 2228.0,1231.3 L 2225.0,1226.5 L 2221.1,1225.0 L 2212.9,1221.4 L 2210.6,1219.0 L 2208.1,1213.4 L 2213.7,1215.0 Z";
const RIGHT_UPPER_CUP = "M 2104.4,894.0 L 2106.7,901.2 L 2112.0,905.2 L 2117.1,899.1 L 2119.0,920.0 L 2119.0,939.9 L 2122.3,942.4 L 2125.5,945.0 L 2125.2,968.2 L 2129.0,1008.4 L 2131.9,1011.6 L 2132.2,1028.4 L 2135.0,1047.0 L 2138.0,1061.1 L 2141.0,1074.0 L 2144.1,1085.4 L 2147.3,1098.4 L 2150.4,1108.0 L 2154.0,1117.8 L 2157.0,1126.4 L 2160.0,1135.8 L 2163.0,1143.9 L 2165.9,1149.3 L 2169.2,1157.4 L 2162.7,1155.4 L 2159.5,1150.5 L 2157.5,1156.7 L 2159.7,1165.7 L 2163.4,1171.6 L 2169.6,1167.2 L 2174.4,1162.6 L 2176.0,1168.5 L 2178.5,1175.7 L 2180.5,1186.7 L 2175.7,1183.6 L 2171.4,1181.1 L 2170.0,1184.2 L 2180.3,1198.9 L 2183.0,1204.5 L 2184.6,1212.1 L 2185.0,1218.3 L 2182.5,1239.5 L 2179.6,1261.5 L 2175.0,1287.4 L 2172.6,1295.8 L 2169.1,1308.2 L 2166.0,1318.2 L 2163.1,1327.1 L 2159.6,1337.5 L 2157.0,1343.8 L 2153.5,1353.0 L 2150.0,1362.1 L 2147.6,1367.0 L 2144.1,1374.2 L 2141.0,1380.2 L 2138.0,1387.0 L 2134.5,1394.2 L 2131.4,1399.2 L 2127.9,1405.3 L 2125.0,1410.5 L 2122.5,1414.0 L 2120.0,1417.4 L 2109.1,1433.4 L 2107.0,1436.4 L 2103.0,1442.5 L 2099.0,1448.2 L 2096.3,1451.8 L 2081.5,1467.5 L 2064.5,1485.1 L 2057.0,1492.3 L 2052.3,1495.4 L 2049.0,1497.5 L 2044.2,1499.0 L 2042.3,1497.2 L 2044.0,1493.6 L 2045.5,1488.4 L 2046.9,1484.9 L 2043.6,1483.3 L 2037.0,1470.9 L 2042.0,1461.5 L 2045.0,1454.0 L 2039.9,1439.6 L 2037.0,1431.8 L 2039.5,1424.5 L 2043.4,1410.5 L 2038.4,1401.0 L 2031.5,1390.5 L 2033.0,1380.5 L 2037.5,1382.0 L 2040.7,1385.1 L 2041.8,1382.5 L 2042.0,1364.9 L 2037.3,1363.0 L 2031.0,1352.7 L 2034.5,1342.4 L 2038.1,1336.7 L 2036.9,1324.8 L 2032.1,1320.0 L 2027.1,1317.6 L 2026.1,1304.5 L 2025.6,1300.3 L 2028.6,1293.0 L 2031.4,1300.3 L 2033.4,1304.5 L 2035.9,1291.2 L 2034.7,1284.0 L 2031.3,1284.0 L 2024.0,1272.3 L 2026.5,1266.4 L 2030.6,1252.1 L 2025.0,1245.2 L 2023.6,1248.5 L 2024.8,1257.6 L 2022.6,1264.8 L 2019.9,1263.8 L 2020.0,1249.0 L 2019.4,1240.3 L 2017.4,1231.1 L 2015.0,1228.3 L 2013.5,1212.2 L 2014.0,1205.4 L 2012.0,1197.9 L 2008.5,1189.5 L 2007.0,1175.9 L 2013.0,1182.5 L 2014.0,1186.5 L 2018.0,1180.5 L 2006.0,1163.4 L 2000.1,1152.9 L 2006.1,1146.4 L 2010.0,1147.1 L 2009.0,1138.5 L 2005.9,1131.2 L 2003.1,1126.0 L 2000.0,1130.8 L 1993.0,1135.5 L 1992.8,1131.2 L 1993.2,1121.2 L 1990.1,1112.7 L 1987.2,1106.4 L 1994.1,1104.9 L 1998.0,1109.0 L 1994.6,1092.4 L 1987.4,1092.7 L 1983.9,1098.7 L 1980.8,1106.9 L 1977.5,1112.5 L 1974.5,1112.5 L 1974.4,1106.3 L 1972.5,1098.0 L 1975.0,1091.5 L 1982.2,1086.5 L 1986.5,1082.9 L 1989.3,1080.0 L 2007.6,1063.1 L 2010.8,1059.8 L 2015.4,1054.6 L 2021.0,1048.1 L 2024.0,1044.0 L 2027.5,1038.9 L 2031.0,1033.2 L 2033.1,1030.2 L 2037.2,1024.0 L 2040.9,1017.5 L 2043.9,1012.1 L 2046.4,1007.1 L 2049.4,1000.2 L 2053.3,992.0 L 2056.4,984.7 L 2058.9,978.6 L 2062.0,970.4 L 2065.1,961.6 L 2068.5,951.9 L 2071.6,942.9 L 2074.6,932.9 L 2078.1,921.4 L 2081.1,909.9 L 2086.7,894.1 L 2096.3,891.4 L 2104.4,894.0 Z";
const LEFT_UPPER_CUP = "M 810.2,894.0 L 807.9,901.2 L 802.6,905.2 L 797.5,899.1 L 795.6,920.0 L 795.6,939.9 L 792.3,942.4 L 789.1,945.0 L 789.4,968.2 L 785.6,1008.4 L 782.7,1011.6 L 782.4,1028.4 L 779.6,1047.0 L 776.6,1061.1 L 773.6,1074.0 L 770.5,1085.4 L 767.3,1098.4 L 764.2,1108.0 L 760.6,1117.8 L 757.6,1126.4 L 754.6,1135.8 L 751.6,1143.9 L 748.7,1149.3 L 745.4,1157.4 L 751.9,1155.4 L 755.1,1150.5 L 757.1,1156.7 L 754.9,1165.7 L 751.2,1171.6 L 745.0,1167.2 L 740.2,1162.6 L 738.6,1168.5 L 736.1,1175.7 L 734.1,1186.7 L 738.9,1183.6 L 743.2,1181.1 L 744.6,1184.2 L 734.3,1198.9 L 731.6,1204.5 L 730.0,1212.1 L 729.6,1218.3 L 732.1,1239.5 L 735.0,1261.5 L 739.6,1287.4 L 742.0,1295.8 L 745.5,1308.2 L 748.6,1318.2 L 751.5,1327.1 L 755.0,1337.5 L 757.6,1343.8 L 761.1,1353.0 L 764.6,1362.1 L 767.0,1367.0 L 770.5,1374.2 L 773.6,1380.2 L 776.6,1387.0 L 780.1,1394.2 L 783.2,1399.2 L 786.7,1405.3 L 789.6,1410.5 L 792.1,1414.0 L 794.6,1417.4 L 805.5,1433.4 L 807.6,1436.4 L 811.6,1442.5 L 815.6,1448.2 L 818.3,1451.8 L 833.1,1467.5 L 850.1,1485.1 L 857.6,1492.3 L 862.3,1495.4 L 865.6,1497.5 L 870.4,1499.0 L 872.3,1497.2 L 870.6,1493.6 L 869.1,1488.4 L 867.7,1484.9 L 871.0,1483.3 L 877.6,1470.9 L 872.6,1461.5 L 869.6,1454.0 L 874.7,1439.6 L 877.6,1431.8 L 875.1,1424.5 L 871.2,1410.5 L 876.2,1401.0 L 883.1,1390.5 L 881.6,1380.5 L 877.1,1382.0 L 873.9,1385.1 L 872.8,1382.5 L 872.6,1364.9 L 877.3,1363.0 L 883.6,1352.7 L 880.1,1342.4 L 876.5,1336.7 L 877.7,1324.8 L 882.5,1320.0 L 887.5,1317.6 L 888.5,1304.5 L 889.0,1300.3 L 886.0,1293.0 L 883.2,1300.3 L 881.2,1304.5 L 878.7,1291.2 L 879.9,1284.0 L 883.3,1284.0 L 890.6,1272.3 L 888.1,1266.4 L 884.0,1252.1 L 889.6,1245.2 L 891.0,1248.5 L 889.8,1257.6 L 892.0,1264.8 L 894.7,1263.8 L 894.6,1249.0 L 895.2,1240.3 L 897.2,1231.1 L 899.6,1228.3 L 901.1,1212.2 L 900.6,1205.4 L 902.6,1197.9 L 906.1,1189.5 L 907.6,1175.9 L 901.6,1182.5 L 900.6,1186.5 L 896.6,1180.5 L 908.6,1163.4 L 914.5,1152.9 L 908.5,1146.4 L 904.6,1147.1 L 905.6,1138.5 L 908.7,1131.2 L 911.5,1126.0 L 914.6,1130.8 L 921.6,1135.5 L 921.8,1131.2 L 921.4,1121.2 L 924.5,1112.7 L 927.4,1106.4 L 920.5,1104.9 L 916.6,1109.0 L 920.0,1092.4 L 927.2,1092.7 L 930.7,1098.7 L 933.8,1106.9 L 937.1,1112.5 L 940.1,1112.5 L 940.2,1106.3 L 942.1,1098.0 L 939.6,1091.5 L 932.4,1086.5 L 928.1,1082.9 L 925.3,1080.0 L 907.0,1063.1 L 903.8,1059.8 L 899.2,1054.6 L 893.6,1048.1 L 890.6,1044.0 L 887.1,1038.9 L 883.6,1033.2 L 881.5,1030.2 L 877.4,1024.0 L 873.7,1017.5 L 870.7,1012.1 L 868.2,1007.1 L 865.2,1000.2 L 861.3,992.0 L 858.2,984.7 L 855.7,978.6 L 852.6,970.4 L 849.5,961.6 L 846.1,951.9 L 843.0,942.9 L 840.0,932.9 L 836.5,921.4 L 833.5,909.9 L 827.9,894.1 L 818.3,891.4 L 810.2,894.0 Z";
const LEFT_WING = "M 617.0,1257.9 L 615.1,1262.2 L 611.2,1266.7 L 607.0,1270.0 L 611.6,1274.0 L 619.4,1318.0 L 620.4,1372.5 L 621.4,1418.5 L 623.6,1488.0 L 603.0,1494.7 L 599.2,1496.9 L 609.1,1501.0 L 619.1,1502.9 L 621.4,1504.7 L 618.8,1506.4 L 604.2,1507.2 L 588.1,1503.6 L 570.5,1500.6 L 555.8,1498.5 L 542.0,1494.0 L 531.2,1492.8 L 532.0,1482.2 L 534.0,1479.0 L 531.7,1478.1 L 526.2,1476.0 L 521.9,1472.9 L 518.0,1471.0 L 511.0,1475.6 L 515.9,1483.7 L 506.0,1487.8 L 491.0,1484.6 L 472.1,1482.0 L 457.6,1482.0 L 454.4,1478.5 L 451.2,1475.0 L 434.9,1475.0 L 418.6,1475.0 L 415.7,1472.2 L 397.0,1469.2 L 381.1,1468.8 L 379.3,1466.2 L 377.5,1462.7 L 376.0,1461.0 L 375.8,1460.0 L 387.5,1454.0 L 376.9,1451.0 L 373.0,1449.5 L 365.6,1449.6 L 368.5,1457.6 L 370.8,1461.7 L 351.6,1462.8 L 330.5,1460.2 L 316.0,1457.0 L 295.3,1456.0 L 284.3,1454.1 L 253.7,1450.0 L 230.6,1450.0 L 227.8,1447.3 L 225.0,1444.7 L 196.3,1444.3 L 160.0,1441.0 L 131.9,1437.5 L 109.0,1437.0 L 106.0,1435.0 L 114.9,1432.0 L 120.3,1427.2 L 115.4,1425.7 L 106.8,1419.6 L 104.6,1397.7 L 104.5,1379.8 L 107.3,1377.4 L 120.3,1375.0 L 168.7,1371.4 L 190.0,1368.5 L 208.0,1365.7 L 220.4,1362.5 L 232.4,1359.3 L 242.0,1356.3 L 251.0,1353.2 L 258.0,1349.3 L 285.1,1332.2 L 297.4,1329.7 L 307.2,1327.1 L 304.6,1323.9 L 303.5,1318.4 L 310.0,1313.7 L 341.7,1312.6 L 368.0,1312.3 L 371.8,1309.6 L 395.4,1307.0 L 422.4,1302.3 L 432.2,1300.5 L 449.2,1300.5 L 461.7,1297.2 L 476.8,1294.2 L 492.0,1291.0 L 506.2,1287.8 L 520.5,1285.0 L 534.2,1281.9 L 548.2,1278.1 L 558.5,1275.0 L 567.5,1272.0 L 576.5,1269.0 L 586.6,1265.5 L 595.6,1262.0 L 605.0,1259.0 L 617.0,1257.9 Z";
const RIGHT_WING = "M 2309.9,1257.9 L 2322.4,1262.5 L 2332.1,1266.1 L 2342.2,1269.0 L 2352.2,1272.0 L 2364.4,1275.0 L 2376.8,1278.1 L 2391.2,1281.9 L 2404.5,1284.3 L 2423.9,1288.0 L 2436.6,1288.0 L 2438.8,1290.9 L 2441.0,1293.9 L 2455.8,1294.2 L 2474.6,1297.2 L 2478.6,1300.0 L 2501.6,1300.0 L 2524.5,1300.0 L 2527.2,1303.2 L 2529.9,1306.5 L 2568.6,1307.0 L 2609.5,1316.2 L 2610.1,1321.9 L 2616.2,1323.9 L 2627.7,1330.7 L 2647.7,1344.7 L 2652.0,1347.1 L 2657.4,1350.4 L 2663.4,1353.8 L 2669.8,1356.0 L 2678.4,1359.2 L 2689.3,1362.7 L 2701.9,1366.0 L 2720.9,1369.5 L 2742.3,1372.6 L 2794.8,1376.0 L 2807.0,1377.0 L 2809.9,1381.1 L 2810.1,1423.9 L 2783.4,1427.0 L 2767.8,1427.1 L 2767.0,1431.5 L 2785.2,1431.6 L 2793.2,1431.1 L 2801.7,1432.0 L 2809.0,1435.0 L 2798.4,1438.5 L 2786.2,1441.4 L 2782.3,1444.0 L 2744.7,1444.8 L 2704.1,1447.8 L 2686.8,1450.1 L 2659.4,1450.9 L 2642.4,1454.2 L 2616.2,1457.7 L 2591.7,1460.8 L 2571.8,1463.0 L 2554.1,1463.0 L 2552.0,1466.0 L 2549.9,1469.0 L 2533.7,1469.0 L 2508.8,1473.0 L 2490.3,1475.0 L 2473.8,1475.0 L 2470.6,1478.4 L 2467.5,1481.8 L 2451.7,1482.2 L 2435.8,1482.5 L 2433.8,1485.2 L 2431.8,1488.0 L 2418.0,1488.0 L 2404.2,1488.0 L 2401.7,1491.0 L 2399.1,1494.0 L 2386.4,1494.0 L 2373.8,1494.0 L 2370.6,1497.4 L 2367.5,1500.8 L 2352.4,1501.2 L 2334.3,1504.1 L 2319.9,1507.4 L 2305.5,1510.0 L 2297.5,1511.1 L 2299.0,1509.0 L 2301.0,1506.1 L 2311.4,1500.6 L 2319.3,1496.2 L 2316.4,1494.7 L 2301.0,1494.3 L 2297.7,1490.0 L 2299.5,1384.5 L 2300.5,1303.0 L 2301.0,1283.3 L 2307.6,1273.4 L 2316.4,1276.4 L 2329.1,1281.4 L 2339.0,1279.0 L 2331.0,1274.7 L 2322.7,1271.9 L 2312.9,1270.3 L 2302.1,1257.7 L 2309.9,1257.9 Z";
const BRIDGE_AND_CRADLE = "M 1446.4,1288.1 L 1449.0,1291.7 L 1452.0,1290.0 L 1458.3,1287.4 L 1471.8,1287.4 L 1477.1,1287.9 L 1479.0,1296.5 L 1483.0,1306.0 L 1485.9,1306.0 L 1485.3,1320.4 L 1484.7,1334.9 L 1488.4,1337.1 L 1492.1,1339.2 L 1491.4,1345.1 L 1494.8,1357.2 L 1498.0,1366.5 L 1501.3,1374.8 L 1504.0,1381.0 L 1507.0,1390.0 L 1510.0,1395.6 L 1513.9,1405.0 L 1516.0,1409.1 L 1519.4,1415.4 L 1522.9,1421.9 L 1526.0,1426.7 L 1529.0,1433.7 L 1531.9,1437.9 L 1535.4,1443.4 L 1539.0,1449.9 L 1542.0,1454.0 L 1545.0,1456.5 L 1548.0,1459.6 L 1550.4,1463.3 L 1553.8,1469.2 L 1559.7,1477.4 L 1565.5,1483.0 L 1585.5,1503.5 L 1590.8,1508.2 L 1593.8,1511.2 L 1597.9,1515.1 L 1603.7,1519.4 L 1607.7,1522.4 L 1612.3,1526.0 L 1616.0,1529.1 L 1619.8,1531.9 L 1624.7,1535.8 L 1629.0,1538.5 L 1634.3,1541.6 L 1637.7,1544.0 L 1641.9,1547.1 L 1648.9,1550.7 L 1655.1,1554.1 L 1661.5,1557.0 L 1667.4,1559.9 L 1674.3,1563.4 L 1681.9,1566.6 L 1692.9,1569.4 L 1699.0,1572.5 L 1708.0,1575.5 L 1717.0,1578.5 L 1728.1,1581.7 L 1742.0,1584.4 L 1765.6,1588.6 L 1788.3,1590.8 L 1808.1,1595.0 L 1816.4,1596.6 L 1816.8,1601.5 L 1811.6,1603.6 L 1797.8,1602.4 L 1787.4,1603.4 L 1807.3,1606.5 L 1817.4,1606.5 L 1834.5,1606.6 L 1829.8,1601.8 L 1824.6,1599.7 L 1830.8,1595.4 L 1836.6,1591.9 L 1841.8,1590.2 L 1843.2,1601.8 L 1841.1,1613.7 L 1835.8,1618.4 L 1833.0,1621.5 L 1830.3,1618.2 L 1818.0,1615.0 L 1805.5,1618.0 L 1797.5,1617.4 L 1789.2,1615.0 L 1773.5,1619.0 L 1768.0,1619.1 L 1760.0,1614.1 L 1752.9,1612.6 L 1748.8,1616.2 L 1744.4,1620.2 L 1731.3,1620.7 L 1724.0,1620.3 L 1731.3,1614.0 L 1736.6,1610.0 L 1728.2,1608.1 L 1720.8,1606.5 L 1718.1,1609.8 L 1715.7,1614.3 L 1703.6,1614.5 L 1690.7,1611.6 L 1678.9,1609.0 L 1667.3,1606.2 L 1655.8,1602.0 L 1646.3,1599.4 L 1637.7,1596.3 L 1628.9,1592.9 L 1620.4,1590.0 L 1610.0,1586.5 L 1602.9,1583.0 L 1596.8,1580.3 L 1586.9,1577.2 L 1578.9,1574.4 L 1568.5,1570.7 L 1560.0,1567.5 L 1553.8,1564.2 L 1546.6,1561.0 L 1533.5,1558.0 L 1521.9,1555.7 L 1519.6,1552.8 L 1498.2,1552.0 L 1477.9,1552.0 L 1475.4,1549.5 L 1473.2,1543.7 L 1479.0,1538.7 L 1485.3,1536.0 L 1480.8,1533.5 L 1473.8,1529.9 L 1463.6,1531.7 L 1460.1,1535.5 L 1463.2,1538.7 L 1464.9,1544.0 L 1438.2,1546.3 L 1411.7,1548.1 L 1395.0,1551.5 L 1377.6,1554.9 L 1365.9,1558.2 L 1353.8,1561.3 L 1347.7,1564.0 L 1339.8,1568.1 L 1330.9,1571.2 L 1321.8,1574.3 L 1316.0,1577.0 L 1307.0,1580.0 L 1297.1,1584.0 L 1291.2,1586.7 L 1282.2,1590.2 L 1272.7,1592.9 L 1263.6,1595.9 L 1254.6,1598.6 L 1238.6,1603.0 L 1231.9,1605.5 L 1218.9,1609.1 L 1203.6,1612.9 L 1187.3,1615.0 L 1172.8,1615.6 L 1170.4,1618.5 L 1168.0,1621.5 L 1117.5,1621.5 L 1065.4,1619.8 L 1067.2,1611.0 L 1076.9,1609.8 L 1079.7,1611.8 L 1082.4,1608.3 L 1085.2,1604.8 L 1088.9,1608.4 L 1100.9,1612.0 L 1112.7,1609.9 L 1119.8,1609.5 L 1139.6,1608.8 L 1153.5,1608.0 L 1160.8,1608.1 L 1169.8,1605.0 L 1183.0,1602.2 L 1202.4,1597.4 L 1208.5,1598.0 L 1213.9,1599.4 L 1219.1,1597.4 L 1225.3,1594.4 L 1226.0,1590.5 L 1219.3,1587.3 L 1210.5,1583.9 L 1205.6,1583.1 L 1199.9,1589.0 L 1192.6,1595.0 L 1189.4,1592.5 L 1173.1,1593.5 L 1150.8,1596.4 L 1142.2,1595.8 L 1139.4,1598.9 L 1129.5,1601.4 L 1119.9,1599.4 L 1112.1,1600.0 L 1100.4,1600.5 L 1095.2,1599.0 L 1088.8,1597.4 L 1083.5,1598.4 L 1076.8,1601.6 L 1070.4,1599.4 L 1066.7,1594.3 L 1067.5,1590.4 L 1072.8,1588.8 L 1130.3,1588.2 L 1161.2,1585.0 L 1174.3,1582.3 L 1190.2,1578.5 L 1199.6,1576.0 L 1214.7,1572.4 L 1222.9,1569.8 L 1232.4,1566.5 L 1239.5,1563.6 L 1246.3,1560.7 L 1252.5,1557.5 L 1257.8,1553.7 L 1263.0,1551.0 L 1271.1,1547.4 L 1275.4,1545.0 L 1283.0,1541.4 L 1287.5,1538.1 L 1294.1,1534.6 L 1298.2,1532.0 L 1308.0,1521.7 L 1313.0,1519.0 L 1317.7,1516.6 L 1323.4,1513.4 L 1327.1,1510.4 L 1330.5,1507.0 L 1333.0,1504.5 L 1335.8,1501.3 L 1340.3,1496.8 L 1343.3,1494.0 L 1345.8,1491.5 L 1349.5,1488.0 L 1352.0,1485.8 L 1355.3,1481.4 L 1364.4,1468.5 L 1371.3,1459.7 L 1377.7,1450.6 L 1380.1,1445.9 L 1383.5,1441.9 L 1387.5,1438.0 L 1390.0,1432.1 L 1392.8,1425.8 L 1396.0,1419.6 L 1399.5,1413.0 L 1402.3,1406.6 L 1404.3,1401.1 L 1409.2,1393.5 L 1412.3,1388.2 L 1415.0,1379.2 L 1418.1,1368.9 L 1421.1,1358.9 L 1423.6,1346.0 L 1427.9,1331.1 L 1430.6,1317.9 L 1433.8,1301.7 L 1435.0,1288.6 L 1443.1,1286.1 L 1446.4,1288.1 Z";
// LARGE ORGANIC PATH CONSTANTS END

// GarmentVisualizer renders Front and Back SVGs side-by-side
// Props:
// - garmentType: 'biustonosz', 'majtki', 'bralet'
// - selectedPartId: string (e.g. 'fabric', 'lace', 'elastic_trim')
// - onPartClick: function(partId)
// - partColors: object mapping partId -> hex color string (defaults to light grey)
export default function GarmentVisualizer({
  garmentType,
  selectedPartId,
  onPartClick,
  partColors = {},
  showLabels = true
}) {
  const [hoveredPartId, setHoveredPartId] = useState(null);

  const getPartColor = (partId, defaultColor = '#ffffff') => {
    if (partId === 'fabric') {
      return partColors.fabric_elastic || partColors.fabric_stable || partColors.tulle_elastic || partColors.tulle_stable || partColors.fabric || defaultColor;
    }
    if (partId === 'lace') {
      return partColors.lace_elastic || partColors.lace_stable || partColors.lace || defaultColor;
    }
    return partColors[partId] || defaultColor;
  };

  const getPartStroke = (partId) => {
    const isSelected = selectedPartId === partId ||
      (partId === 'fabric' && (selectedPartId === 'fabric_elastic' || selectedPartId === 'fabric_stable' || selectedPartId === 'tulle_elastic' || selectedPartId === 'tulle_stable')) ||
      (partId === 'lace' && (selectedPartId === 'lace_elastic' || selectedPartId === 'lace_stable'));
    return isSelected ? '#c9a236' : '#a49e95';
  };

  const getPartStrokeWidth = (partId) => {
    const isSelected = selectedPartId === partId ||
      (partId === 'fabric' && (selectedPartId === 'fabric_elastic' || selectedPartId === 'fabric_stable' || selectedPartId === 'tulle_elastic' || selectedPartId === 'tulle_stable')) ||
      (partId === 'lace' && (selectedPartId === 'lace_elastic' || selectedPartId === 'lace_stable'));
    return isSelected ? '2.5' : '1.2';
  };

  const defaultGuideColors = {
    miseczki: '#3B82F6', // Blue
    material: '#8B5CF6', // Purple
    koronka: '#EC4899', // Pink
    tiul_elastyczny: '#06B6D4', // Cyan
    tiul_stabilny: '#14B8A6', // Teal
    guma_obszywkowa: '#F59E0B', // Amber
    guma_ramiackowa: '#10B981', // Emerald
    kolka: '#EF4444', // Red
    regulatory: '#EF4444', // Red
    haftka: '#84CC16', // Lime
    fiszbiny: '#6366F1', // Indigo
    tunel_gorseciarski: '#D946EF', // Fuchsia
    kokardka: '#EAB308', // Yellow
  };

  const mapGuidePartIdToMainId = (id) => {
    switch (id) {
      case 'material':
      case 'miseczki':
      case 'fabric':
        if (selectedPartId === 'fabric_elastic' || selectedPartId === 'fabric_stable' || selectedPartId === 'tulle_elastic' || selectedPartId === 'tulle_stable') {
          return selectedPartId;
        }
        return 'fabric_elastic';
      case 'koronka':
      case 'lace':
        if (selectedPartId === 'lace_elastic' || selectedPartId === 'lace_stable') {
          return selectedPartId;
        }
        return 'lace_elastic';
      case 'tiul_elastyczny':
        return 'tulle_elastic';
      case 'tiul_stabilny':
        return 'tulle_stable';
      case 'guma_obszywkowa':
        return 'elastic_trim';
      case 'guma_ramiackowa':
        return 'elastic_strap';
      case 'kolka':
        return 'ring';
      case 'regulatory':
        return 'slider';
      case 'haftka':
        return 'closure';
      case 'fiszbiny':
        return 'underwire';
      case 'tunel_gorseciarski':
        return 'tunnel';
      case 'kokardka':
        return 'bow';
      default:
        return id;
    }
  };

  const isPartSelected = (guideId) => {
    const mainId = mapGuidePartIdToMainId(guideId);
    return !!partColors[mainId] || 
      (guideId === 'koronka' && (partColors.lace_elastic || partColors.lace_stable || partColors.lace)) ||
      ((guideId === 'material' || guideId === 'miseczki') && (partColors.fabric_elastic || partColors.fabric_stable || partColors.tulle_elastic || partColors.tulle_stable || partColors.fabric));
  };

  const getGuidePartColor = (guideId) => {
    if (guideId === 'koronka') {
      return partColors.lace_elastic || partColors.lace_stable || partColors.lace || defaultGuideColors[guideId] || '#e2ded5';
    }
    if (guideId === 'material' || guideId === 'miseczki') {
      return partColors.fabric_elastic || partColors.fabric_stable || partColors.tulle_elastic || partColors.tulle_stable || partColors.fabric || defaultGuideColors[guideId] || '#e2ded5';
    }
    if (guideId === 'tiul_elastyczny') {
      return partColors.tulle_elastic || defaultGuideColors[guideId] || '#e2ded5';
    }
    if (guideId === 'tiul_stabilny') {
      return partColors.tulle_stable || defaultGuideColors[guideId] || '#e2ded5';
    }
    const mainId = mapGuidePartIdToMainId(guideId);
    return partColors[mainId] || defaultGuideColors[guideId] || '#e2ded5';
  };

  const isPartActive = (id) => {
    if (hoveredPartId === id) return true;
    if (id === 'koronka') {
      return selectedPartId === 'lace_elastic' || selectedPartId === 'lace_stable' || selectedPartId === 'lace';
    }
    if (id === 'material' || id === 'miseczki') {
      return selectedPartId === 'fabric_elastic' || selectedPartId === 'fabric_stable' || selectedPartId === 'tulle_elastic' || selectedPartId === 'tulle_stable' || selectedPartId === 'fabric';
    }
    return mapGuidePartIdToMainId(id) === selectedPartId;
  };

  const getPartStyle = (id) => {
    const active = isPartActive(id);
    const selected = isPartSelected(id);
    const color = getGuidePartColor(id);
    
    let fill = '#ffffff';
    if (selected) {
      fill = color;
    } else if (active) {
      const guideColor = defaultGuideColors[id] || '#c9a236';
      fill = `${guideColor}35`;
    }
    
    let stroke = '#1e293b';
    if (active || selected) {
      stroke = color;
    }
    
    return {
      fill,
      stroke,
      strokeWidth: active ? '3.5' : '1.8',
      transition: 'all 0.25s ease-in-out',
      cursor: 'pointer',
    };
  };

  const getLineStyle = (id, thickness = 1.8) => {
    const active = isPartActive(id);
    const selected = isPartSelected(id);
    const color = getGuidePartColor(id);
    
    let stroke = '#1e293b';
    if (selected || active) {
      stroke = color;
    }
    
    return {
      stroke,
      strokeWidth: active ? thickness + 2 : thickness,
      fill: 'none',
      transition: 'all 0.25s ease-in-out',
      cursor: 'pointer',
    };
  };

  const getPartName = (partId) => {
    switch (partId) {
      case 'fabric': return 'Miseczki (główny kształt)';
      case 'fabric_elastic': return 'Tkanina elastyczna';
      case 'fabric_stable': return 'Tkanina stabilna';
      case 'lace': return 'Koronka elastyczna';
      case 'lace_elastic': return 'Koronka elastyczna';
      case 'lace_stable': return 'Koronka stabilna';
      case 'tulle_elastic': return 'Tiul elastyczny';
      case 'tulle_stable': return 'Tiul stabilny';
      case 'elastic_trim': return 'Guma obszywkowa (obwód)';
      case 'elastic_strap': return 'Guma ramiączkowa';
      case 'ring': return 'Kółka metalowe';
      case 'slider': return 'Regulatory metalowe';
      case 'closure': return 'Zapięcie haftkowe';
      case 'underwire': return 'Fiszbiny metalowe';
      case 'bow': return 'Kokardka ozdobna';
      case 'tunnel': return 'Tunel gorseciarski';
      case 'threads': return 'Nici Ariadna Talia 120';
      default: return partId;
    }
  };

  const renderBiustonosz = () => {
    return (
      <div className="garment-visualizer" style={{ flexDirection: 'column', padding: '1.5rem', alignItems: 'center' }}>
        <div className="view-section" style={{ width: '100%', maxWidth: '950px' }}>
          
          {/* SVG Interaction Guides */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11px',
            color: '#94a3b8',
            fontFamily: 'monospace',
            marginBottom: '0.75rem',
            width: '100%',
            padding: '0 0.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-dot" style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ec4899',
              }} />
              <span>Interaktywny model wektorowy</span>
            </div>
            <div>
              {selectedPartId ? (
                <span>Wybrano: <strong style={{ color: '#475569' }}>{getPartName(selectedPartId)}</strong></span>
              ) : (
                <span>Najedź lub kliknij część, by wyodrębnić</span>
              )}
            </div>
          </div>

          <svg
            id="interactive-bra-svg"
            viewBox="0 0 3000 2121"
            className="garment-svg"
            style={{ width: '100%', height: 'auto', userSelect: 'none', overflow: 'visible' }}
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* SVG Defs for markers and visual artifacts */}
            <defs>
              <marker
                id="pointer-arrow"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="12"
                markerHeight="12"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 10 5 L 0 8.5 Z" fill="#475569" />
              </marker>
            </defs>

            {/* Ambient drafting board style background grid */}
            <g stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="10 10" opacity="0.65">
              <line x1="1457.3" y1="50" x2="1457.3" y2="2070" />
              <line x1="100" y1="1380" x2="2900" y2="1380" />
              <line x1="450" y1="200" x2="2550" y2="1920" opacity="0.4" />
              <line x1="2550" y1="200" x2="450" y2="1920" opacity="0.4" />
            </g>

            {/* ========================================================= */}
            {/* LAYER 1: BACK WINGS / ELASTIC POWERNET (tiul_elastyczny)  */}
            {/* ========================================================= */}
            <g
              id="wing-left-panel"
              onMouseEnter={() => setHoveredPartId('tiul_elastyczny')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('tiul_elastyczny'))}
            >
              <path
                d={LEFT_WING}
                style={getPartStyle('tiul_elastyczny')}
              />
            </g>

            <g
              id="wing-right-panel"
              onMouseEnter={() => setHoveredPartId('tiul_elastyczny')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('tiul_elastyczny'))}
            >
              <path
                d={RIGHT_WING}
                style={getPartStyle('tiul_elastyczny')}
              />
            </g>

            {/* ========================================================= */}
            {/* LAYER 2: THE BACK CLOSURE & HOOK-AND-EYE TAPE (haftka)     */}
            {/* ========================================================= */}
            <g
              id="part-haftka-closure"
              onMouseEnter={() => setHoveredPartId('haftka')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('haftka'))}
            >
              <rect
                x="60"
                y="1350"
                width="38"
                height="90"
                style={getPartStyle('haftka')}
              />
              <rect
                x="2810"
                y="1350"
                width="80"
                height="90"
                style={getPartStyle('haftka')}
              />
            </g>

            {/* ========================================================= */}
            {/* LAYER 3: THE STABLE TRAPEZOIDAL CENTER BRIDGE (tiul_stabilny) */}
            {/* ========================================================= */}
            <g
              id="part-bridge-core"
              onMouseEnter={() => setHoveredPartId('tiul_stabilny')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('tiul_stabilny'))}
            >
              <path
                d={BRIDGE_AND_CRADLE}
                style={getPartStyle('tiul_stabilny')}
              />
            </g>

            {/* ========================================================= */}
            {/* LAYER 4: LOWER CUPS (material)                            */}
            {/* ========================================================= */}
            <g
              id="part-lower-cups"
              onMouseEnter={() => setHoveredPartId('material')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('material'))}
            >
              <path
                d={LEFT_LOWER_CUP}
                style={getPartStyle('material')}
              />
              <path
                d={RIGHT_LOWER_CUP}
                style={getPartStyle('material')}
              />
            </g>

            {/* ========================================================= */}
            {/* LAYER 5: UPPER CUPS INTRICATE PANELS (koronka)            */}
            {/* ========================================================= */}
            <g
              id="part-upper-cups-lace"
              onMouseEnter={() => setHoveredPartId('koronka')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('koronka'))}
            >
              <path
                d={LEFT_UPPER_CUP}
                style={getPartStyle('koronka')}
              />
              <path
                d={RIGHT_UPPER_CUP}
                style={getPartStyle('koronka')}
              />
            </g>

            {/* ========================================================= */}
            {/* LAYER 6: EDGE ENVELOPING ELASTICS (guma_obszywkowa)        */}
            {/* ========================================================= */}
            <g
              id="part-obszywkowa-band-elastics"
              onMouseEnter={() => setHoveredPartId('guma_obszywkowa')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('guma_obszywkowa'))}
            >
              {/* Left & Right wing bottom elastics */}
              <path d="M 98,1440 C 200,1440 350,1460 623.6,1488.0" style={getLineStyle('guma_obszywkowa', 10)} />
              <path d="M 2810,1440 C 2708,1440 2558,1460 2297.5,1488.0" style={getLineStyle('guma_obszywkowa', 10)} />
              {/* Left & Right wing top elastics */}
              <path d="M 98,1350 C 200,1350 350,1320 617.0,1257.9" style={getLineStyle('guma_obszywkowa', 8)} />
              <path d="M 2810,1350 C 2708,1350 2558,1320 2309.9,1257.9" style={getLineStyle('guma_obszywkowa', 8)} />
            </g>

            {/* ========================================================= */}
            {/* LAYER 7: CHANNELS & WIRE CASING COVERS (tunel_gorseciarski) */}
            {/* ========================================================= */}
            <g
              id="part-wire-casing-tunnel"
              onMouseEnter={() => setHoveredPartId('tunel_gorseciarski')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('tunel_gorseciarski'))}
            >
              <path d="M 630,1270 C 700,1550 900,1620 1025,1430" style={getLineStyle('tunel_gorseciarski', 26)} />
              <path d="M 2284.6,1270 C 2214.6,1550 2014.6,1620 1889.6,1430" style={getLineStyle('tunel_gorseciarski', 26)} />
            </g>

            {/* ========================================================= */}
            {/* LAYER 8: UNDERWIRES (fiszbiny)                             */}
            {/* ========================================================= */}
            <g
              id="part-metal-underwires"
              onMouseEnter={() => setHoveredPartId('fiszbiny')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('fiszbiny'))}
            >
              <path d="M 630,1270 C 700,1550 900,1620 1025,1430" style={getLineStyle('fiszbiny', 10)} />
              <path d="M 2284.6,1270 C 2214.6,1550 2014.6,1620 1889.6,1430" style={getLineStyle('fiszbiny', 10)} />
            </g>

            {/* ========================================================= */}
            {/* LAYER 9: SHOULDER STRAPS (guma_ramiackowa)                */}
            {/* ========================================================= */}
            <g
              id="part-straps-elastic"
              onMouseEnter={() => setHoveredPartId('guma_ramiackowa')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('guma_ramiackowa'))}
            >
              <path d="M 301.6,1320 C 301.6,800 450,460 550,460 C 650,460 780,700 780,1000" style={getLineStyle('guma_ramiackowa', 24)} />
              <path d="M 2613.0,1320 C 2613.0,800 2464.6,460 2364.6,460 C 2264.6,460 2134.6,700 2134.6,1000" style={getLineStyle('guma_ramiackowa', 24)} />
            </g>

            {/* ========================================================= */}
            {/* LAYER 10: RINGS (kolka)                                    */}
            {/* ========================================================= */}
            <g
              id="part-hardware-rings"
              onMouseEnter={() => setHoveredPartId('kolka')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('kolka'))}
            >
              <circle cx="301.6" cy="827.1" r="22" style={getPartStyle('kolka')} strokeWidth="4" />
              <circle cx="2613.0" cy="827.1" r="22" style={getPartStyle('kolka')} strokeWidth="4" />
              <circle cx="301.6" cy="1320" r="22" style={getPartStyle('kolka')} strokeWidth="4" />
              <circle cx="2613.0" cy="1320" r="22" style={getPartStyle('kolka')} strokeWidth="4" />
            </g>

            {/* ========================================================= */}
            {/* LAYER 11: SLIDERS (regulatory)                             */}
            {/* ========================================================= */}
            <g
              id="part-hardware-adjusters"
              onMouseEnter={() => setHoveredPartId('regulatory')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('regulatory'))}
            >
              <rect x="760" y="685" width="40" height="30" rx="6" style={getPartStyle('regulatory')} strokeWidth="4" />
              <rect x="2114.6" y="685" width="40" height="30" rx="6" style={getPartStyle('regulatory')} strokeWidth="4" />
            </g>

            {/* ========================================================= */}
            {/* LAYER 12: DECORATIVE BOW (kokardka)                        */}
            {/* ========================================================= */}
            <g
              id="part-ribbon-bow"
              onMouseEnter={() => setHoveredPartId('kokardka')}
              onMouseLeave={() => setHoveredPartId(null)}
              onClick={() => onPartClick(mapGuidePartIdToMainId('kokardka'))}
            >
              <circle cx="1457.3" cy="1280" r="12" style={getPartStyle('kokardka')} strokeWidth="2.5" />
              <path d="M 1457.3,1280 C 1417.3,1240 1397.3,1320 1457.3,1280 Z" style={getPartStyle('kokardka')} strokeWidth="2" />
              <path d="M 1457.3,1280 C 1497.3,1240 1517.3,1320 1457.3,1280 Z" style={getPartStyle('kokardka')} strokeWidth="2" />
            </g>

            {/* ========================================================= */}
            {/* LAYER 13: THE OUTLINE OVERLAY (185 Paths from SVG)         */}
            {/* ========================================================= */}
            <BraOutlines />

            {/* ========================================================= */}
            {/* LAYER 14: TECHNICAL LABELS AND POINTERS                    */}
            {/* ========================================================= */}
            {showLabels && (
              <g id="technical-annotations" style={{ pointerEvents: 'none', transition: 'all 0.3s' }}>
                {/* 1. Strap Elastic - Guma ramiączkowa */}
                <path d="M 700 400 L 460 520" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="715" y="410" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="start">guma ramiączkowa</text>

                <path d="M 2214 400 L 2454 520" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="2199" y="410" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="end">guma ramiączkowa</text>

                {/* 2. Top cup neckline elastic - Guma obszywkowa (dekolt) */}
                <path d="M 1457 780 Q 1280 830 1080 1020" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <path d="M 1457 780 Q 1634 830 1834 1020" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="1457" y="740" fontFamily="Montserrat, sans-serif" fontSize="30" fontWeight="bold" fill="#1e293b" textAnchor="middle">guma obszywkowa (dekolt)</text>

                {/* 3. Upper Cup - Tkanina lub koronka */}
                <text x="850" y="1100" fontFamily="Montserrat, sans-serif" fontSize="26" fontWeight="bold" fill="#475569" textAnchor="middle">tkanina lub koronka</text>
                <text x="2060" y="1100" fontFamily="Montserrat, sans-serif" fontSize="26" fontWeight="bold" fill="#475569" textAnchor="middle">tkanina lub koronka</text>

                {/* 4. Lower Cup - Dolna część miseczki */}
                <text x="850" y="1450" fontFamily="Montserrat, sans-serif" fontSize="26" fontWeight="600" fill="#475569" textAnchor="middle">dolna część miseczki</text>
                <text x="2060" y="1450" fontFamily="Montserrat, sans-serif" fontSize="26" fontWeight="600" fill="#475569" textAnchor="middle">dolna część miseczki</text>

                {/* 5. Hook and eye closure - Haftka */}
                <path d="M 220 1320 L 79 1395" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="235" y="1310" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="start">haftka (zapięcie)</text>

                <path d="M 2690 1320 L 2850 1395" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="2675" y="1310" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="end">haftka (zapięcie)</text>

                {/* 6. Wings - Skrzydełko obwodu */}
                <path d="M 435 1320 L 350 1380" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="445" y="1310" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="start">skrzydełko obwodu</text>

                <path d="M 2480 1320 L 2564 1380" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="2465" y="1310" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="end">skrzydełko obwodu</text>

                {/* 7. Underband - Dolna guma obszywkowa */}
                <path d="M 250 1780 L 350 1480" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="235" y="1810" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="start">guma obszywkowa (dół)</text>

                <path d="M 2664 1780 L 2564 1480" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="2679" y="1810" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="end">guma obszywkowa (dół)</text>

                {/* 8. Underwire casing - Tunel gorseciarski */}
                <path d="M 660 1880 L 850 1560" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="650" y="1910" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="bold" fill="#334155" textAnchor="middle">tunel gorseciarski</text>

                <path d="M 2254 1880 L 2064 1560" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="2264" y="1910" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="bold" fill="#334155" textAnchor="middle">tunel gorseciarski</text>

                {/* 9. Underwires - Fiszbiny */}
                <path d="M 1100 1880 L 980 1580" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="1100" y="1910" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="middle">fiszbiny</text>

                <path d="M 1814 1880 L 1934 1580" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="1814" y="1910" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="middle">fiszbiny</text>

                {/* 10. Center Gore - Mostek */}
                <text x="1457" y="1320" fontFamily="Montserrat, sans-serif" fontSize="30" fontWeight="bold" fill="#1e293b" textAnchor="middle">mostek</text>

                {/* 11. Mostek do miseczki */}
                <path d="M 1320 1830 L 1380 1480" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="1320" y="1860" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="middle">mostek do miseczki</text>

                {/* 12. Rings - Kółka */}
                <path d="M 600 820 L 323 827" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="615" y="810" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#334155" textAnchor="start">kółko (łącznik)</text>

                <path d="M 2314 820 L 2591 827" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="2299" y="810" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#334155" textAnchor="end">kółko (łącznik)</text>

                {/* 13. Sliders - Regulatory */}
                <path d="M 520 580 L 760 685" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="535" y="600" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="start">regulatory</text>

                <path d="M 2394 580 L 2154 685" fill="none" stroke="#475569" strokeWidth="2.5" markerEnd="url(#pointer-arrow)" />
                <text x="2379" y="600" fontFamily="Montserrat, sans-serif" fontSize="28" fontWeight="600" fill="#475569" textAnchor="end">regulatory</text>
              </g>
            )}
          </svg>
          <span className="view-label">Anatomia Biustonosza (Rysunek płaski)</span>
        </div>
      </div>
    );
  };

  // Render Panties (Majtki) SVGs
  const renderMajtki = () => {
    const mainColor = getPartColor('fabric');
    const extraColor = getPartColor('fabric_extra', '#eae8e3'); // additional decorative panel
    const laceColor = getPartColor('lace');
    const gussetColor = getPartColor('gusset', '#e2ded5'); // Bawełna na klin
    const elasticColor = getPartColor('elastic_trim');
    const threadColor = getPartColor('threads', '#888');

    return (
      <div className="garment-visualizer">
        {/* FRONT VIEW */}
        <div className="view-section">
          <svg width="240" height="240" viewBox="0 0 260 260" className="garment-svg">
            <g transform="translate(0, 30)">
              {/* Front main fabric panel */}
              <path
                d="M 40,60 C 65,65 195,65 220,60 C 205,100 170,160 155,185 C 145,188 115,188 105,185 C 90,160 55,100 40,60 Z"
                fill={mainColor}
                stroke={getPartStroke('fabric')}
                strokeWidth={getPartStrokeWidth('fabric')}
                className="interactive-part"
                onClick={() => onPartClick(mapGuidePartIdToMainId('fabric'))}
              />

              {/* Decorative Material 2 Panels (fabric_extra) */}
              <path
                d="M 60,61 C 75,90 90,110 100,120 L 100,62 Z"
                fill={extraColor}
                stroke={getPartStroke('fabric_extra')}
                strokeWidth={getPartStrokeWidth('fabric_extra')}
                className="interactive-part"
                onClick={() => onPartClick('fabric_extra')}
              />
              <path
                d="M 200,61 C 185,90 170,110 160,120 L 160,62 Z"
                fill={extraColor}
                stroke={getPartStroke('fabric_extra')}
                strokeWidth={getPartStrokeWidth('fabric_extra')}
                className="interactive-part"
                onClick={() => onPartClick('fabric_extra')}
              />

              {/* Decorative Lace Inserts on the sides */}
              <path
                d="M 40,60 C 48,72 58,88 68,102 C 60,95 50,80 40,60 Z"
                fill={laceColor}
                stroke={getPartStroke('lace')}
                strokeWidth={getPartStrokeWidth('lace')}
                className="interactive-part"
                onClick={() => onPartClick(mapGuidePartIdToMainId('lace'))}
              />
              <path
                d="M 220,60 C 212,72 202,88 192,102 C 200,95 210,80 220,60 Z"
                fill={laceColor}
                stroke={getPartStroke('lace')}
                strokeWidth={getPartStrokeWidth('lace')}
                className="interactive-part"
                onClick={() => onPartClick(mapGuidePartIdToMainId('lace'))}
              />

              {/* Gusset (klin) outline visible inside front */}
              <path
                d="M 107,175 C 115,145 145,145 153,175 C 150,182 110,182 107,175 Z"
                fill={gussetColor}
                stroke={getPartStroke('gusset')}
                strokeWidth={getPartStrokeWidth('gusset')}
                strokeDasharray="3,3"
                className="interactive-part"
                onClick={() => onPartClick('gusset')}
              />

              {/* Waistband Elastic Trim */}
              <path
                d="M 40,60 C 65,65 195,65 220,60 L 220,63 C 195,68 65,68 40,63 Z"
                fill={elasticColor}
                stroke={getPartStroke('elastic_trim')}
                strokeWidth={getPartStrokeWidth('elastic_trim')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_trim')}
              />

              {/* Left leg opening elastic */}
              <path
                d="M 40,60 C 55,100 90,160 105,185 L 103,186 C 88,161 53,101 38,61 Z"
                fill={elasticColor}
                stroke={getPartStroke('elastic_trim')}
                strokeWidth={getPartStrokeWidth('elastic_trim')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_trim')}
              />

              {/* Right leg opening elastic */}
              <path
                d="M 220,60 C 205,100 170,160 155,185 L 157,186 C 172,161 207,101 222,61 Z"
                fill={elasticColor}
                stroke={getPartStroke('elastic_trim')}
                strokeWidth={getPartStrokeWidth('elastic_trim')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_trim')}
              />

              {/* Thread stitches lines */}
              <path
                d="M 45,67 C 70,71 190,71 215,67"
                fill="none"
                stroke={threadColor}
                strokeWidth="0.8"
                strokeDasharray="2,2"
              />
            </g>
          </svg>
          <span className="view-label">Przód</span>
        </div>

        {/* BACK VIEW */}
        <div className="view-section">
          <svg width="240" height="240" viewBox="0 0 260 260" className="garment-svg">
            <g transform="translate(0, 30)">
              {/* Back main panel (usually wider coverage) */}
              <path
                d="M 40,60 C 65,65 195,65 220,60 C 200,110 168,170 155,185 C 145,188 115,188 105,185 C 92,170 60,110 40,60 Z"
                fill={mainColor}
                stroke={getPartStroke('fabric')}
                strokeWidth={getPartStrokeWidth('fabric')}
                className="interactive-part"
                onClick={() => onPartClick(mapGuidePartIdToMainId('fabric'))}
              />

              {/* Waistband Elastic Trim */}
              <path
                d="M 40,60 C 65,65 195,65 220,60 L 220,63 C 195,68 65,68 40,63 Z"
                fill={elasticColor}
                stroke={getPartStroke('elastic_trim')}
                strokeWidth={getPartStrokeWidth('elastic_trim')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_trim')}
              />

              {/* Left leg opening elastic */}
              <path
                d="M 40,60 C 60,110 92,170 105,185 L 103,186 C 90,171 58,111 38,61 Z"
                fill={elasticColor}
                stroke={getPartStroke('elastic_trim')}
                strokeWidth={getPartStrokeWidth('elastic_trim')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_trim')}
              />

              {/* Right leg opening elastic */}
              <path
                d="M 220,60 C 200,110 168,170 155,185 L 157,186 C 170,171 202,111 222,61 Z"
                fill={elasticColor}
                stroke={getPartStroke('elastic_trim')}
                strokeWidth={getPartStrokeWidth('elastic_trim')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_trim')}
              />
            </g>
          </svg>
          <span className="view-label">Tył</span>
        </div>
      </div>
    );
  };

  // Render Bralette (Bralet) SVGs
  const renderBralet = () => {
    const mainColor = getPartColor('fabric'); // Main cup lining / elastyczny tiul
    const laceColor = getPartColor('lace');   // Lace cups
    const elasticColor = getPartColor('elastic_trim');
    const strapColor = getPartColor('elastic_strap');
    const ringColor = getPartColor('ring', '#d1d5db');
    const sliderColor = getPartColor('slider', '#d1d5db');
    const closureColor = getPartColor('closure');
    const bowColor = getPartColor('bow');
    const insertColor = getPartColor('cup_insert', 'rgba(255, 255, 255, 0.4)');
    const underwireColor = getPartColor('underwire', '#bfb5a8');
    const tunnelColor = getPartColor('tunnel', '#e2ded5');

    return (
      <div className="garment-visualizer">
        {/* FRONT VIEW */}
        <div className="view-section">
          <svg width="240" height="240" viewBox="0 0 260 260" className="garment-svg">
            <g transform="translate(0, 20)">
              {/* Back wing elastics visible on sides */}
              <line x1="30" y1="145" x2="80" y2="145" stroke={elasticColor} strokeWidth="6" />
              <line x1="180" y1="145" x2="230" y2="145" stroke={elasticColor} strokeWidth="6" />

              {/* Left Triangle Cup (Main Lace) */}
              <path
                d="M 80,145 L 130,145 L 105,65 Z"
                fill={laceColor}
                stroke={getPartStroke('lace')}
                strokeWidth={getPartStrokeWidth('lace')}
                className="interactive-part"
                onClick={() => onPartClick(mapGuidePartIdToMainId('lace'))}
              />

              {/* Left Cup Inside Insert outline (visible) */}
              <path
                d="M 85,142 L 125,142 L 105,80 Z"
                fill={insertColor}
                stroke={getPartStroke('cup_insert')}
                strokeWidth="0.8"
                strokeDasharray="2,2"
                className="interactive-part"
                onClick={() => onPartClick('cup_insert')}
              />

              {/* Right Triangle Cup (Main Lace) */}
              <path
                d="M 130,145 L 180,145 L 155,65 Z"
                fill={laceColor}
                stroke={getPartStroke('lace')}
                strokeWidth={getPartStrokeWidth('lace')}
                className="interactive-part"
                onClick={() => onPartClick(mapGuidePartIdToMainId('lace'))}
              />

              {/* Right Cup Inside Insert outline */}
              <path
                d="M 135,142 L 175,142 L 155,80 Z"
                fill={insertColor}
                stroke={getPartStroke('cup_insert')}
                strokeWidth="0.8"
                strokeDasharray="2,2"
                className="interactive-part"
                onClick={() => onPartClick('cup_insert')}
              />

              {/* Bralet side underwires (underwire & tunnel) */}
              <line 
                x1="80" y1="145" x2="80" y2="110" 
                stroke={tunnelColor} 
                strokeWidth={selectedPartId === 'tunnel' ? '4' : '2.5'}
                className="interactive-part"
                onClick={() => onPartClick('tunnel')}
              />
              <line 
                x1="80" y1="141" x2="80" y2="114" 
                stroke={underwireColor} 
                strokeWidth={selectedPartId === 'underwire' ? '2.5' : '1.5'}
                className="interactive-part"
                onClick={() => onPartClick('underwire')}
              />

              <line 
                x1="180" y1="145" x2="180" y2="110" 
                stroke={tunnelColor} 
                strokeWidth={selectedPartId === 'tunnel' ? '4' : '2.5'}
                className="interactive-part"
                onClick={() => onPartClick('tunnel')}
              />
              <line 
                x1="180" y1="141" x2="180" y2="114" 
                stroke={underwireColor} 
                strokeWidth={selectedPartId === 'underwire' ? '2.5' : '1.5'}
                className="interactive-part"
                onClick={() => onPartClick('underwire')}
              />

              {/* Underband Elastic Band (Front bottom band) */}
              <rect
                x="80" y="145" width="100" height="6"
                fill={elasticColor}
                stroke={getPartStroke('elastic_trim')}
                strokeWidth={getPartStrokeWidth('elastic_trim')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_trim')}
              />

              {/* Straps (Front) */}
              <rect
                x="103" y="15" width="4" height="50"
                fill={strapColor}
                stroke={getPartStroke('elastic_strap')}
                strokeWidth={getPartStrokeWidth('elastic_strap')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_strap')}
              />
              <rect
                x="153" y="15" width="4" height="50"
                fill={strapColor}
                stroke={getPartStroke('elastic_strap')}
                strokeWidth={getPartStrokeWidth('elastic_strap')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_strap')}
              />

              {/* Center bow */}
              <circle
                cx="130" cy="144" r="3.5"
                fill={bowColor}
                stroke={getPartStroke('bow')}
                strokeWidth={getPartStrokeWidth('bow')}
                className="interactive-part"
                onClick={() => onPartClick('bow')}
              />
            </g>
          </svg>
          <span className="view-label">Przód</span>
        </div>

        {/* BACK VIEW */}
        <div className="view-section">
          <svg width="240" height="240" viewBox="0 0 260 260" className="garment-svg">
            <g transform="translate(0, 20)">
              {/* Back Mesh/Lining Band Wings (fabric) */}
              <path
                d="M 30,139 C 55,143 95,145 120,145 L 120,154 C 95,154 55,150 30,144 Z"
                fill={mainColor}
                stroke={getPartStroke('fabric')}
                strokeWidth={getPartStrokeWidth('fabric')}
                className="interactive-part"
                onClick={() => onPartClick(mapGuidePartIdToMainId('fabric'))}
              />
              <path
                d="M 230,139 C 205,143 165,145 140,145 L 140,154 C 165,154 205,150 230,144 Z"
                fill={mainColor}
                stroke={getPartStroke('fabric')}
                strokeWidth={getPartStrokeWidth('fabric')}
                className="interactive-part"
                onClick={() => onPartClick(mapGuidePartIdToMainId('fabric'))}
              />

              {/* Hook Closure (Back center) */}
              <rect
                x="120" y="139" width="20" height="16"
                fill={closureColor}
                stroke={getPartStroke('closure')}
                strokeWidth={getPartStrokeWidth('closure')}
                className="interactive-part"
                onClick={() => onPartClick('closure')}
              />

              {/* Straps (Back) */}
              <rect
                x="70" y="15" width="4" height="126"
                fill={strapColor}
                stroke={getPartStroke('elastic_strap')}
                strokeWidth={getPartStrokeWidth('elastic_strap')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_strap')}
              />
              <rect
                x="186" y="15" width="4" height="126"
                fill={strapColor}
                stroke={getPartStroke('elastic_strap')}
                strokeWidth={getPartStrokeWidth('elastic_strap')}
                className="interactive-part"
                onClick={() => onPartClick('elastic_strap')}
              />

              {/* Rings */}
              <circle
                cx="72" cy="141" r="4"
                fill="none"
                stroke={ringColor}
                strokeWidth={getPartStrokeWidth('ring')}
                className="interactive-part"
                onClick={() => onPartClick('ring')}
              />
              <circle
                cx="188" cy="141" r="4"
                fill="none"
                stroke={ringColor}
                strokeWidth={getPartStrokeWidth('ring')}
                className="interactive-part"
                onClick={() => onPartClick('ring')}
              />

              {/* Sliders */}
              <rect
                x="69" y="60" width="6" height="3"
                fill={sliderColor}
                stroke={getPartStroke('slider')}
                strokeWidth={getPartStrokeWidth('slider')}
                className="interactive-part"
                onClick={() => onPartClick('slider')}
              />
              <rect
                x="185" y="60" width="6" height="3"
                fill={sliderColor}
                stroke={getPartStroke('slider')}
                strokeWidth={getPartStrokeWidth('slider')}
                className="interactive-part"
                onClick={() => onPartClick('slider')}
              />
            </g>
          </svg>
          <span className="view-label">Tył</span>
        </div>
      </div>
    );
  };

  switch (garmentType) {
    case 'majtki':
      return renderMajtki();
    case 'bralet':
      return renderBralet();
    case 'biustonosz':
    default:
      return renderBiustonosz();
  }
}
