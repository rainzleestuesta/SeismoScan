// src/lib/geo.ts
export function kmBetween([lon1, lat1]: [number, number], [lon2, lat2]: [number, number]) {
  const R = 6371, toRad = (d: number) => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
export function bearingFrom(a: [number, number], b: [number, number]) {
  const toRad = (d:number)=>d*Math.PI/180, toDeg=(r:number)=>r*180/Math.PI;
  const [lon1, lat1] = [toRad(a[0]), toRad(a[1])];
  const [lon2, lat2] = [toRad(b[0]), toRad(b[1])];
  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2 - lon1);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}
export const bandColor = (b: "Low"|"Moderate"|"High") => b==="High"?"#ef4444":b==="Moderate"?"#f59e0b":"#22c55e";
