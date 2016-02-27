#This script used to properly format the historical data for the 10 individual companies we looked at  

# Set working directory and and libraries 
setwd("~/newsapps/JetsR")
library(dplyr)
library(tidyr)

# Read in CSV
d <- read.csv("constellation.csv",stringsAsFactor=F,na.strings="na")

# Reformat to long rather than wide format
d <- gather(d, key="date", value="value", -name)
# Get rid of the X in the date column
d$date <- gsub("X","", d$date)

# Rename column headings
d <- select(d,date=date,category=name,value=value)

# Export CSV
write.csv(d, "constellationCleaned.csv", row.names=F)
