---
title: SSH tunnel notes for bastion-hosted Postgres
description: Draft notes on opening an SSH-tunneled production connection in /table. Waiting on a human publish review.
publishedAt: 2026-08-25
published: false
tags:
  - ssh
  - postgres
tldr: Draft. Production behind a bastion is a normal connection in the app. This file stays unpublished until a human flips published to true.
image: /blog/ssh-tunnel-notes.jpg
imageAlt: A dark curved pedestrian tunnel lit by repeating ring lights.
imageCredit: Photo by Maxime Lebrun on Unsplash
imageCreditUrl: https://unsplash.com/photos/itllPhoHWeE
---

## Draft

This file is a workflow fixture. It must stay `published: false` until a human opens a PR that flips the flag.

Topics to expand before publish:

1. Create the connection in /table with SSH tunneling enabled.
2. Confirm credentials stay on the machine.
3. Mark the tunneled prod connection hidden before enabling MCP for an agent.
