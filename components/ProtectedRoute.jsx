export default function ProtectedRoute({ error }) {
  return (
    <>
      <h1>404</h1>
      <p>This route is protected. If you believe this to be an error, please contact the administrator</p>

      {error ?? <p>Error message: {error}</p>}
    </>
  )
}
