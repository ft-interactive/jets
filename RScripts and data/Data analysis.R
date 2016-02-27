# This script was used to analyse the data to find the top spending companies and recipient executives
# as well as to see if there was a skew in the distribution of spending across companies,
# It also looks at: spending by industry, male/female ratios, correlation with market cap, location of spenders' HQs
#function for trimming trailing/leading white spaces
trim <- function (x) gsub("^\\s+|\\s+$", "", x)

#set working directory and load packages
setwd("~/newsapps/JetsR")
packages <-c("ggplot2","tidyr","dplyr")
lapply(packages,require,character.only=T)

#import data
rawdata <- read.csv("data.csv",stringsAsFactor=F,na.strings="na")

#clean name columns
rawdata$firstName <- trim(rawdata$firstName)
rawdata$lastName <- trim(rawdata$lastName)

#create fullName column
rawdata$fullName <- paste0(rawdata$firstName," ",rawdata$lastName)
#create column summing 2013 and 2014
rawdata$sum <- rawdata$X2013+rawdata$X2014

#subset out useful columns into the 'data' dataframe
data <- select(rawdata, fullName, companyName, gender, X2013, X2014, companyIndustry, meanMktCap, address)

#format the data into long rather than wide format
data <- data %>%
  gather(key="year", value = "jetSpend", X2013, X2014)

data$year <- data$year %>%
  gsub("X","", .) %>%
  as.numeric()

#group by company

companydata <- data %>% 
  group_by(companyName, year) %>%
  summarise(companyIndustry=head(companyIndustry,1), jetSpend = sum(jetSpend)) %>%
  mutate(totalSpend=sum(jetSpend))

#Create dataframe for 2013 company data, sorted by jetSpend
df13 <- companydata %>%
  filter(year == "2013", jetSpend > 0) %>%
  ungroup() %>%
  arrange(desc(jetSpend))

#Create dataframe for 2014 company data, sorted by jetSpend
df14 <- companydata %>%
  filter(year == "2014", jetSpend > 0) %>%
  ungroup() %>%
  arrange(desc(jetSpend))

#calculate how much of total spend the top decile accounts for
decileSpend <- sum(df14$jetSpend[1:47])
decilePortion <- round(decileSpend/sum(df14$jetSpend, na.rm = T) * 100, 1)  

#Generate top ten lists for 2013 and 2014
topTenPeople13 <- data %>%
  filter(year == "2013") %>%
  arrange(desc(jetSpend)) %>%
  slice(1:10) %>%
  select(-year)

topTenPeople14 <- data %>%
  filter(year == "2014") %>%
  arrange(desc(jetSpend)) %>%
  slice(1:10) %>%
  select(-year)

#output data for scatter

jetscatter <- select(df14, "y"=jetSpend,"name"=companyName)
jetscatter <- mutate(jetscatter, "x"=as.numeric(rownames(df14)))
jetscatter <- select(jetscatter, x,y,name)

#add y1 column for cumulative spend
jetscatter <- within(jetscatter, y1 <- cumsum(y))

#export csv
write.csv(jetscatter,"jetscatter.csv",row.names = F)

#industry comparisons
dataByIndustry13 <- df13 %>% 
  group_by(companyIndustry) %>%
  summarise(total=sum(jetSpend, na.rm=T),
            count=length(jetSpend),
            mean=mean(jetSpend, na.rm=T),
            median=median(jetSpend, na.rm=T))

dataByIndustry14 <- df14 %>% 
  group_by(companyIndustry) %>%
  summarise(total=sum(jetSpend, na.rm=T),
            count=length(jetSpend),
            mean=mean(jetSpend, na.rm=T),
            median=median(jetSpend, na.rm=T))

#2013 bar chart
dataByIndustry13$companyIndustry <- factor(dataByIndustry13$companyIndustry, levels= dataByIndustry13$companyIndustry[order(dataByIndustry13$mean)], ordered=T)

ggplot(dataByIndustry13,aes(x=companyIndustry,y=mean))+
  geom_bar(stat="identity") +
  coord_flip()

#2014 bar chart
dataByIndustry14$companyIndustry <- factor(dataByIndustry14$companyIndustry, levels= dataByIndustry14$companyIndustry[order(dataByIndustry14$mean)], ordered=T)

ggplot(dataByIndustry14,aes(x=companyIndustry,y=mean))+
  geom_bar(stat="identity") +
  coord_flip()

#male/female ratio

ggplot(data, aes(gender,X2014))+
  geom_bar(stat='identity')+
  coord_flip()

#correlation
corrData <- data %>% filter(!is.na(sum)&!is.na(meanMktCap))
cor(corrData$sum, corrData$meanMktCap)

#geographic location
data <- data %>% mutate(newCol = geocode(address,output="latlon"))

a <- geocode(data$address, output = "latlon")
data <- cbind(data, a)

mapWorld <- borders("world", colour="gray80", fill="gray90")
mp <- ggplot(data) +   mapWorld + theme_bw()
mp <- mp+ geom_point(aes(lon,lat,size=sum) ,color="red")
mp

#map all S&P500 HQs

fullAddress <- read.csv("fulladdress.csv",stringsAsFactor=F,na.strings="na")
fullAddress <- fullAddress %>% mutate(newCol = geocode(address,output="latlon"))

latLon <- geocode(fullAddress$address, output = "latlon")
fullAddress <- cbind(fullAddress, latLon)

