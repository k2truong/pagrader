import {createValidator, required, maxLength, email} from 'utils/validation';

export default createValidator({
  name: [required, maxLength(10)],
  email: [required, email],
  occupation: maxLength(20) // single rules don't have to be in an array
});
