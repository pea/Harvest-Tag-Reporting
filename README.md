# Harvest Tag Reporting
Output time spent on projects with specific title tags. Useful when your client wants a breakdown of time spent on each of their clients.

# Instructions
Tags appear at the beginning of the project name. Each one is enclosed in square brackets. There is a maximum of 3 tags.

For example:

```
[tag 1][tag 2][tag 3] Project Name
[Nike] Website Build
[Nike] iPhone App
[Burberry][JC7682] Android App
[Burberry][JC2234][Christmas] Christmas Campaign 
```

We can then find out how much time was spent on Nike and Burberry by specifying that we'd like to group by tag 1.

After running `node index.js` the prompt will ask a series of questions:

- Email and password: the ones you login to Harvest with
- Subdomain: The first part of your Harvest domain. I.e. peabay is the subdomain of peabay.harvestapp.com 
- fromDate: The date to collect hours from
- toDate: The date to collect hours until 
- Tag to group: The tag number (1-3)
- Round, roundup or none: Whether to round entries, round up entries or apply no rounding. This should match the setting in Harvest
- Round to 6, 15 or 30 minutes: The minutes to round to. This should match the setting in Harvest

On completion each unique tag will be listed along with the number of hours spent on it.

# Notes
- Reporting is for one user only - the one logging in