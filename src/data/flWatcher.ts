type flAction = {
  type : string,
  payload : any,
  userID : string,
  time : number,
}

const flActionWatcher = (event : CustomEvent) : void => {
  console.group('flActionWatcher()');
  const { type, payload, userID, time } : flAction = event.detail;
  console.log('type:', type);
  console.log('payload:', payload);
  console.log('userID:', userID);
  console.log('time:', time);

  console.groupEnd();
};

const html = document.querySelector('html');

if (html !== null) {
  html.addEventListener('flaction', flActionWatcher);
}
