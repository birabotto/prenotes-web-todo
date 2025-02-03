export default function dateFormat(date: string) {
  return new Date(date).toISOString().split("T")[0].replace(/-/g, "/");
}
