export function show(content: string) {
  const app = window.document.getElementById('app');
  const body = window.document.getElementsByTagName('body')[0];
  const h1 = document.createElement('h1');
  h1.innerHTML = '只是h1' + content;
  body.appendChild(h1);
  app.innerText = 'Hellow,' + content;
}