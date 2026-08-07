export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type TraceEvent = {
  label: string;
  detail: string;
};

export type AgentReply = {
  answer: string;
  route: "menu" | "order" | "menu + order";
  trace: TraceEvent[];
};

type MenuItem = {
  name: string;
  cuisine: string;
  price: number;
  dietary: string[];
  available: boolean;
};

type Order = {
  orderId: string;
  item: string;
  email: string;
  trackingId: string;
  status: string;
  eta: string;
};

const menu: MenuItem[] = [
  { name: "Margherita Pizza", cuisine: "Italian", price: 299, dietary: ["vegetarian"], available: true },
  { name: "Vegan Pasta Primavera", cuisine: "Italian", price: 349, dietary: ["vegan"], available: true },
  { name: "Butter Chicken", cuisine: "Indian", price: 379, dietary: ["gluten-free"], available: true },
  { name: "Vegan Buddha Bowl", cuisine: "Fusion", price: 319, dietary: ["vegan", "gluten-free"], available: true },
  { name: "Classic Cheeseburger", cuisine: "American", price: 259, dietary: [], available: true },
  { name: "Paneer Tikka", cuisine: "Indian", price: 199, dietary: ["vegetarian", "gluten-free"], available: true },
  { name: "Aglio e Olio", cuisine: "Italian", price: 279, dietary: ["vegan"], available: false },
  { name: "Mango Lassi", cuisine: "Indian", price: 99, dietary: ["vegetarian", "gluten-free"], available: true },
];

const orders: Order[] = [
  { orderId: "ORD-201", item: "Butter Chicken", email: "priya@example.com", trackingId: "SS201TRK", status: "Out for Delivery", eta: "15 minutes" },
  { orderId: "ORD-202", item: "Margherita Pizza", email: "arjun@example.com", trackingId: "SS202TRK", status: "Placed", eta: "35 minutes" },
  { orderId: "ORD-203", item: "Classic Cheeseburger", email: "sneha@example.com", trackingId: "SS203TRK", status: "Preparing", eta: "25 minutes" },
  { orderId: "ORD-204", item: "Vegan Buddha Bowl", email: "rahul@example.com", trackingId: "SS204TRK", status: "Delivered", eta: "Delivered" },
  { orderId: "ORD-205", item: "Paneer Tikka", email: "kavya@example.com", trackingId: "SS205TRK", status: "Placed", eta: "40 minutes" },
];

const orderPattern = /\b(?:ORD-\d{3}|SS\d{3}TRK)\b|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const orderWords = /\b(order|track|tracking|delivery|status|where is|eta)\b/i;
const menuWords = /\b(menu|food|eat|dish|pizza|pasta|vegan|vegetarian|indian|italian|american|fusion|price|under|recommend|hungry|lassi|chicken|paneer|burger)\b/i;

function identifyRoute(query: string): "menu" | "order" | "menu + order" {
  const wantsOrder = orderWords.test(query) || orderPattern.test(query);
  const wantsMenu = menuWords.test(query);
  if (wantsOrder && wantsMenu) return "menu + order";
  if (wantsOrder) return "order";
  return "menu";
}

function searchMenu(query: string): MenuItem[] {
  const lowered = query.toLowerCase();
  const cuisine = ["indian", "italian", "american", "fusion"].find((value) => lowered.includes(value));
  const dietary = ["vegan", "vegetarian", "gluten-free"].find((value) => lowered.includes(value));
  const priceMatch = lowered.match(/under\s*(?:₹|rs\.?\s*)?(\d+)/i);
  const maxPrice = priceMatch ? Number(priceMatch[1]) : undefined;
  const namedTerms = ["pizza", "pasta", "chicken", "bowl", "burger", "paneer", "lassi"].filter((term) => lowered.includes(term));

  const results = menu.filter((item) => {
    if (!item.available) return false;
    if (cuisine && item.cuisine.toLowerCase() !== cuisine) return false;
    if (dietary && !item.dietary.includes(dietary)) return false;
    if (maxPrice && item.price > maxPrice) return false;
    if (namedTerms.length && !namedTerms.some((term) => item.name.toLowerCase().includes(term))) return false;
    return true;
  });

  return results.slice(0, 3);
}

function menuAnswer(query: string): string {
  const results = searchMenu(query);
  if (!results.length) return "I couldn't find an available item matching all of those filters. Try relaxing the cuisine, dietary, or price constraint.";
  return `Here ${results.length === 1 ? "is" : "are"} ${results.length === 1 ? "a matching option" : "the best matching options"}: ${results
    .map((item) => `${item.name} for ₹${item.price}`)
    .join(", ")}.`;
}

function findOrder(query: string): Order | undefined {
  const match = query.match(orderPattern)?.[0];
  if (!match) return undefined;
  const normalized = match.toLowerCase();
  return orders.find((order) =>
    [order.orderId, order.email, order.trackingId].some((identifier) => identifier.toLowerCase() === normalized),
  );
}

function orderAnswer(query: string): string {
  const identifier = query.match(orderPattern)?.[0];
  if (!identifier) return "I can check that. Please provide an order ID, tracking ID, or customer email.";
  const order = findOrder(query);
  if (!order) return `I couldn't find an order matching ${identifier}. Please check the identifier and try again.`;
  return `${order.orderId} for ${order.item} is ${order.status}. Estimated delivery: ${order.eta}.`;
}

function isIdentifierFollowUp(messages: ChatMessage[]): boolean {
  const previousAssistant = [...messages].reverse().find((message) => message.role === "assistant");
  return Boolean(previousAssistant?.content.includes("order ID, tracking ID, or customer email"));
}

export function runDemoAgent(messages: ChatMessage[]): AgentReply {
  const latest = messages.at(-1)?.content.trim() ?? "";
  const followUp = orderPattern.test(latest) && isIdentifierFollowUp(messages.slice(0, -1));
  const route = followUp ? "order" : identifyRoute(latest);
  const trace: TraceEvent[] = [
    { label: "Orchestrator", detail: `Selected ${route} specialist${route === "menu + order" ? "s" : ""}` },
  ];

  const answers: string[] = [];
  if (route.includes("menu")) {
    const matches = searchMenu(latest);
    trace.push({ label: "Menu tool", detail: `Applied metadata filters · ${matches.length} result${matches.length === 1 ? "" : "s"}` });
    answers.push(menuAnswer(latest));
  }
  if (route.includes("order")) {
    const identifier = latest.match(orderPattern)?.[0];
    trace.push({
      label: identifier ? "Order tool" : "Human input",
      detail: identifier ? `Looked up ${identifier}` : "Paused for a missing identifier",
    });
    answers.push(orderAnswer(latest));
  }
  trace.push({ label: "Synthesis", detail: "Returned a grounded response" });

  return { answer: answers.join(" "), route, trace };
}
