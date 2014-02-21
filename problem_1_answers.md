**Calendar map**

1. The audience for this visualization is someone who is familiar with Github. Most likely, it's a fellow programmer.

2. The data are times of git pushes. The raw info can be gotten through a call to Github's Events API. Here's an example: *curl https://api.github.com/users/pjsinco/events*.
I can then count the push events for each date.

3. There would be a lag in that day's update. If it were critical for the calendar to be up-to-the-minute accurate, I could authenticate my API calls so my program could query the API more frequently.

**Contributors**

1. Someone who knows what Github is. Someone who is interested in contributing to the repo or already is contributing.

2. First a call to Github's Repositories API to get a list of contributors: *curl https://api.github.com/repos/ireapps/first-news-app/contributors*. Then another call to the same API to git a list of commit details: *curl https://api.github.com/repos/ireapps/first-news-app/commits*. With the data, I can build a list of contributors and their activity on the repo.

3. An authenticated query to the API will allow the program to provide more up-to-date information.

**Commits activity**

1. Someone familiar with Github. Someone who is thinking of working on the repo and wants to see how active its developers are. Someone who is thinking of using the code and wants to see how well-supported it is.

2. The data are number of commits for each day of the week, as well as date representations of weeks and and days of the week. Example: *curl https://api.github.com/repos/ireapps/first-news-app/stats/commit_activity*

3. Again, the updates might not propogate quickly enough. But I don't see any other problems.

**Code frequency**

1. Someone who is interested in seeing how active the repo is.

2. The data are dates as Unix timestamps to represent dates and the number of lines added and deleted that week. Example: *curl https://api.github.com/repos/ireapps/first-news-app/stats/code_frequency*

3. The activity would spike for that day. I don't see the problem, except in the case when the applications needs up-to-the-minute data, in which case I would authenticate my app so it could call the Github API more frequently.

**Punch card**

1. Someone who is interested in seeing on what days of teh week the repo's developers are most active. 

2. The data are each day of the week, each hour of the day and number of commits during that hour. Example: *curl https://api.github.com/repos/ireapps/first-news-app/stats/punch_card*

3. I don't see a problem.

**Pulse**

1. A developer interested in forking the repo. The person who created the repo. A project manager.

2. The data are, during the selected time period, the number of accepted pull requests, proposed pull requests, the number of open and closed issues and what those issues are and when they were opened or closed, a list of contributors and the number of commits of each, the number of commits total for the repo, the number of files that have changed, and the number of additions and deletions to the code. 

PULL REQUEST DETAILS
*curl https://api.github.com/repos/ireapps/first-news-app/pulls*

ISSUE DETAILS
*curl https://api.github.com/repos/ireapps/first-news-app/issues*

CONTRIBUTOR DETAILS
*curl https://github.com/pjsinco/cs171-hw2-sinco-patrick/pulse_committer_data*

ADDITION AND DELETION DETAILS
*curl https://api.github.com/repos/ireapps/first-news-app/stats/code_frequency*

3. Many updates in a short period of time would lead to problems with the app being up-to-the-minute accurate. I would authenticate the app.
