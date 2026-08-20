# Note research workflow

Notes become a research memo: title patterns, structure, verbatim comments, and
followable angles. An optional lookup adds one prepaid gate before the memo. Skipping
the lookup is the ordinary shape of this route.

Invoke every remote Beatra tool through the bundled client only. The tool name is
the CLI argument; the arguments are JSON on standard input:

```text
printf '%s' '{"query":"notes","platform":"xiaohongshu","capability_family":"content"}' | python3 scripts/mcp_client.py call beatra.social.tools.search
```

Do not configure or call a host Beatra Connector. Do not fall back to REST or
OpenAPI. Never pass a local path to a remote tool.

## Optional lookup gate — before the memo

Only when the user asks to read a public note, search a category, read comments, or
read a creator's notes. Confirmed on its own, without exception, per
[looking up notes](note-lookup.md).

Name what will be read in plain words together with the `operation_key`, quote the
price `beatra.social.tools.get` just returned, say how many lookups the plan
contains, and say the memo can be written from pasted notes at no cost.

One `beatra.social.execute` is one lookup and one charge. A second page is a
second charge and a second decision. Carry every returned paging field back;
construct none.

## Free stage

Write the memo per [writing the research memo](research-memo.md). Everything in this
stage is free and revisable. A lookup already run cannot be un-run.

## Recovery

Record each task ID immediately and poll only that task. `queued` and `running`
mean wait. If the create response is lost, resubmit only the identical frozen
payload under the same identifier. If a task ID is lost, list tasks, inspect the
match against the saved `operation_key`, arguments, and `schema_hash`, then replay
byte-identical arguments under the same `client_request_id`. `insufficient_balance`
means nothing was charged and the identical request can be resubmitted after a
top-up.
