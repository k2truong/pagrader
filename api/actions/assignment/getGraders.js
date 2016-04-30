import { command } from '../ssh';

export default function getGraders(req, params) {
  return new Promise((resolve, reject) => {
    const socketId = params[0];
    const assignmentId = params[1];

    // List the folders since this is associated with the graders
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
            printf "%s\\n" "$\{files[@]}";`
        }
      }).then((previewList) => {
        if (previewList) {
          data.previewList = previewList.split('\n');
        }

        return resolve(data);
      }).catch(reject);
    }).catch(reject);
  });
}
