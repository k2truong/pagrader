import { command } from '../ssh';

export default function getGraders(req, params) {
  const socketId = params[0];
  const assignmentId = params[1];

  // List the folders since this is associated with the graders
  console.log(req.session);
  return command({
    body: {
      socketId,
      command: `cd .private_repo/${ assignmentId }; ls -d */`
    }
  }).then((graders) => {
    const data = {
      graders: graders ? graders.split('\n') : null
    };

    return command({
      body: {
        socketId,
        command: `cd .private_repo/${ assignmentId };
          shopt -s nullglob;
          files=(*/*.out.html);
          randomNum=RANDOM;
          printf "%s\\n" "$\{files[$randomNum % $\{#files[@]}]}";
          printf "%s\\n" "$\{files[($randomNum + 1) % $\{#files[@]}]}"`
      }
    }).then((samples) => {
      if (samples) {
        data.samples = samples.split('\n');
        // Remove duplicate (This happens if there is only one file)
        if (samples[0] === samples[1]) {
          samples.pop();
        }
      }

      return data;
    });
  });
}
