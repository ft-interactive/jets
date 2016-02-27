# This script takes a form.idx index file from the SEC's EDGAR database,
# and gives you back a list of URLs to the Def-14A proxy forms of S&P500 companies.

# Set working directory and libraries
setwd('~/newsapps/JetsR')
library(dplyr)
library(tidyr)

# Load list of S&P 500 companies. 
# This came from https://en.wikipedia.org/wiki/List_of_S%26P_500_companies
# Since we only looked at filings for FY2014 and 2015, It excludes companies that joined the list after Jan 1, 2014
# Hence there are only 465 companies
sp500 <- read.csv('sp500.csv', strip.white=T, stringsAsFactors = F)

# Load the idx file as a dataframe called listing
listing <- read.fwf('2015Q1.idx', widths = c(12, 62, 12, 12, 43), strip.white = T, fill = T, buffersize = 1000, skip = 10, stringsAsFactor=F)

#We don't need the 'date filed column (i.e. V4)
listing <- listing %>%
  select(-V4)

#Give the columns names
colnames(listing) <- c("form","name","CIK","url")

#keep only the DEF 14A rows
listing <- filter(listing, listing$form=="DEF 14A")

#join the two dataframes to pluck out only the companies we are interested in
joinedlist <- inner_join(listing,sp500)

#convert the url column to the actual url
joinedlist$url <- joinedlist$url %>%
  gsub(".txt", "" , .) %>%
  paste0("http://www.sec.gov/Archives/", . , "-index.html")

#remove unused columns
joinedlist <- select(joinedlist, url, Security, Ticker.symbol, CIK, GICS.Sector)

#rename columns
colnames(joinedlist) <- c("url","name","ticker","CIK","sector")

#export file
write.csv(joinedlist, "urllist.csv", row.names = F)