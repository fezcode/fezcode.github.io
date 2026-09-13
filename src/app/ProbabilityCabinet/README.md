# Probability Cabinet

The app and article embeds share `ProbabilityExperiment`. The cabinet includes probability, strategy, statistics, and deterministic number experiments; every card labels its type.

| Experiment ID       | Settings                                          | Embedded in                               |
| ------------------- | ------------------------------------------------- | ----------------------------------------- |
| `penneys-game`      | `first="HHH" second="THH"`                        | Penney's Game                             |
| `pirate-game`       | `pirates="5" rule="half"`                         | The Pirate Game; The Lost Art of Thinking |
| `bayesian-ratings`  | `rating="9" votes="105" prior="6.5" weight="100"` | An IMDbayes Analysis                      |
| `kaprekars-routine` | `start="3524"`                                    | Kaprekar's Routine                        |

`pirates` accepts 1–5. `rule` is `half` (ties pass) or `majority` (ties fail). Coins are fixed at 100. Numeric Bayesian inputs are bounded; zero votes are valid and return the prior. `start` is four digits, including leading zeros; identical digits demonstrate the 0000 exception.

The pirate model prioritizes survival, then coins, then rejection on equal outcomes. An eliminated pirate is represented by `null`, which is distinct from surviving with zero coins. This matters under strict majority. Equal-cost coalitions choose more senior eligible pirates first.

`experiments.json` is the shared metadata and attribute allowlist for the cabinet selector, Markdown renderer, and RSS fallback. Add an entry there and a component in the dispatcher to extend the collection. Unknown experiment IDs display a link back to the cabinet.

Place this custom element on its own line, with blank lines before and after it, in any blog post:

```html
<probability-experiment
  experiment="penneys-game"
  first="HHH"
  second="THH"
></probability-experiment>
```

Use an explicit closing tag. `first` and `second` accept three-character H/T sequences. Invalid values fall back to a valid pair; identical sequences use a best response for Player 2. The renderer accepts only attributes registered for the chosen experiment and loads the component collection lazily. Existing blog themes use `ExperimentMarkdown` directly or through `MarkdownContent`; their `rehypeRaw` plugin parses the tag.

React callers can use `<ProbabilityExperiment experiment="pirate-game" pirates={5} embedded={false} />`. The full app reads `experiment` and the selected experiment's registered settings from its query string. The embed's app link carries the current settings, not trial history or a pirate's draft offer.

The simulation and absorbing-state probability calculation live in `penney.js`. Batch runs yield between groups of 100 games, and reset or unmount cancels pending work. Changing a pattern clears all results. RSS includes a description and a direct experiment link.
