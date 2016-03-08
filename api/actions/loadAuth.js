export default function loadAuth(req) {
  return Promise.resolve(req.user || null);
}
