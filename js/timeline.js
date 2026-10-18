const events = [
  [
    "19 June 1861",
    "Birth",
    "José Rizal is born in Calamba, Laguna, the seventh of eleven children.",
  ],
  [
    "1882—1887",
    "Europe",
    "He studies medicine and writes the early chapters of Noli Me Tangere.",
  ],
  [
    "1889",
    "La Solidaridad",
    "Rizal publishes essays advocating representation, education, and civil rights.",
  ],
  [
    "3 July 1892",
    "La Liga Filipina",
    "He forms a civic association for unity and mutual assistance in Manila.",
  ],
  [
    "1892—1896",
    "Dapitan",
    "In exile, he works as a doctor, teacher, farmer, and community builder.",
  ],
  [
    "30 December 1896",
    "Martyrdom",
    "Rizal is executed at Bagumbayan; his death intensifies Filipino nationalism.",
  ],
];
export function renderTimeline(target) {
  target.innerHTML = events
    .map(
      ([date, title, description]) =>
        `<li><time>${date}</time><h3>${title}</h3><p>${description}</p></li>`,
    )
    .join("");
}
