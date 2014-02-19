**Calendar map**

1. The audience for this visualization is someone who is familiar with Github. Most likely, it's a fellow programmer.

2. The data are times of git pushes. The raw info can be gotten through a call to Github's Events API. Here's an example: *curl https://api.github.com/users/pjsinco/events*.
I can then count the push events for each date.

3. There would be a lag in that day's update. If it were critical for the calendar to be up-to-the-minute accurate, I could authenticate my API calls so my program could query the API more frequently.

**Contributors**

1. Someone who knows what Github is. Someone who is interested in contributing to the repo or already is contributing.

2. First a call to Github's Repositories API to get a list of contributors: *curl https://api.github.com/repos/ireapps/first-news-app/contributors*. Then another call to the same API to git a list of commit details: *curl https://api.github.com/repos/ireapps/first-news-app/commits*. With the data, I can build a similar list of contributors and their activity on the repo.

3. An authenticated query to the API will allow the program to provide more up-to-date information.



