
export function fillBullet(txt: string): string {
  return txt.replace(/[*-] /g, '• ');
}