# Do I Need to Create a Lib For That?

## My Journey into Go Libraries

Creating my first Go library, [go-tournament-brackets](https://github.com/fezcode/go-tournament-brackets), has been a, _experience_...
It's a project that allowed me to dive deep into Go's capabilities for building reusable and efficient code.
The process of designing the data structures, handling edge cases like automatic bye calculations,
and then building an interactive command-line interface on top of it was both challenging and immensely satisfying.
There's a unique sense of accomplishment in seeing your code not just work, but also be easily consumable by others.

## About `go-tournament-brackets`

`go-tournament-brackets` is a versatile Go library designed for generating and managing single-elimination tournament brackets. It offers two primary components:

*   **A Robust Go Library:** This provides a set of data models and functions that can be integrated into any Go application.
It intelligently handles tournament logic, including the correct calculation of rounds, match-ups, and automatic byes for varying numbers of participants.
*   **An Interactive Command-Line Interface (CLI):** Built on top of the library, this CLI allows users to run a tournament from start to finish.
You can input participant names, visualize the bracket in ASCII art, and interactively determine match winners until a champion is crowned.

This library aims to simplify the process of setting up and managing tournaments, whether you're integrating it into a larger application or running a quick tournament from your terminal.

## Ok, but why?

The inspiration for `go-tournament-brackets` struck during a casual phone call with a friend, Mustafa, (_he personally requested to be named directly_). I was unwinding, listening to [Morcheeba's "Easier Said than Done,"](https://www.youtube.com/watch?v=27lPAUdE1ys)
when he posed a fun challenge: rank our favorite rappers. His idea was to create a bracket, share it, and play through it together. Simple enough, right?

Not quite. As he started looking for online bracket makers, we quickly hit a wall. Most platforms demanded sign-ups,
locked away certain tournament types behind paywalls, and generally overcomplicated what should have been a straightforward,
enjoyable activity. For something so simple, the hoops we had to jump through felt entirely unnecessary.
That's when the idea sparked: why not build my own? A bracket maker that was free, flexible, and didn't force you into a convoluted user experience.
And so, the seed for `go-tournament-brackets` was planted.

## How did I do that?

The journey from idea to a working library began with a deep dive into the mechanics of tournament brackets.
I found myself poring over Wikipedia articles, unraveling the intricacies of single-elimination formats, byes, and seeding.
Once I had a solid grasp of the theoretical underpinnings, I turned to my trusty collaborator, Gemini 2.5-Pro.

My first request to Gemini was simple: "Generate the necessary Go files for a tournament bracket library."
It quickly scaffolded the basic project structure, providing the initial Go files. From there, I started defining the core data structures,
translating the concepts from my research into Go structs. The `models.go` file, which you can see [here](https://raw.githubusercontent.com/fezcode/go-tournament-brackets/refs/heads/main/models.go), was born out of this phase.

```go
// Tournament is the root object that contains all data for a tournament event.
type Tournament struct {
	Name           string
	Rounds         []Round
	TournamentType TournamentType
	Options        *Options
}
```

With the foundational structs in place, Gemini and I embarked on implementing the core logic.
This was where the real challenge and fun began. Handling the "bye" mechanism – __ensuring that teams or competitors who automatically advance in the first round are correctly placed__ – proved to be particularly tricky.
It's not as straightforward as it might seem, but with Gemini's assistance, we iterated through various approaches, and it did its best to help navigate those complexities. It was a true collaborative effort, pushing both my understanding and Gemini's capabilities to deliver a robust solution.

## Getting Your Go Module Out There!

So, you've built your awesome Go package, and now you want to share it with the world (or at least your fellow developers). Here's the lowdown on how to get your module published and discoverable:

1.  **Your `go.mod` File is Key:**
    First things first, make sure your `go.mod` file has the right module path. This should usually point directly to your GitHub repo, like `module github.com/fezcode/go-tournament-brackets`. This is how Go knows where to find your cool new code!

2.  **Tag It, You're It! (Creating a Release):**
    Go modules love Git tags for versioning. Think of a tag as a snapshot of a specific, stable version of your code.
    *   **Tag your commit:** Use `git tag vX.Y.Z` (e.g., `git tag v0.1.0`). We highly recommend following Semantic Versioning (SemVer) – it makes life easier for everyone!
    *   **Push that tag:** Don't forget to push your shiny new tag to GitHub: `git push origin vX.Y.Z`. This is what tells the Go module proxies that a new version exists.

3.  **Letting Go Proxies Know (No, You Don't "Publish" It Directly):**
    Here's a cool part: Go module proxies (like `proxy.golang.org`) are pretty smart. They'll usually find your new module version automatically once you push that tag. You don't typically run a "publish" command.
    *   **Want to nudge it?** If you're impatient (we get it!), you can explicitly ask a proxy to fetch your new version. For example, running `go get github.com/fezcode/go-tournament-brackets@v0.1.0` (or `go list -m ...`) from *any* Go project will make the proxy grab it if it hasn't already. This is more about *verifying* discovery than publishing.

4.  **Patience, Young Padawan (Waiting for `pkg.go.dev`):**
    After your module is tagged and the proxies know about it, `pkg.go.dev` (Go's official package discovery site) will eventually list it. Just a heads-up: this isn't instant. It can take anywhere from a few minutes to a few hours for it to show up. So, grab a coffee, and it'll be there!