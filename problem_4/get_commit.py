#!/usr/bin/env python

import urllib2
import time

url = 'https://api.github.com/repos/propublica/guides/commits/'

#sample_hash = '23a0f1571da851fafed23896c9d8351d7d8ecd91'

hashes = open('all-hashes2.txt', 'r')
f = open('single-commits2.json', 'a')

for line in hashes:
  try:
    result = urllib2.urlopen(url + line)
    f.write(result.read())
    time.sleep(3)
  except urllib2.URLError, e:
    print 'an error occurred'

hashes.close()
f.close()
