import { Button } from "../components/Button.tsx";

export default function DeleteShortCode({code}: {code: string}) {
  return <form onSubmit={async (e) => {
    e.preventDefault();
    await fetch(window.location.href, {method: "DELETE", body: JSON.stringify({shortCode: code})})
  }}>
    <input type="hidden" name="shortCode" value={code} />
    <Button>
      Delete
    </Button>
  </form>
}