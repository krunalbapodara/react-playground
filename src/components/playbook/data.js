export const automation=[
    {name:"Custom Scripts",data:[
        {name:"CommonServerUserPython",description:"Common user defined code that will be merged into each server script when it runs"},
        {name:"CommonUserServer",description:"Common user defined code that will be merged into each server script when it runs"}
    ]},
    {name:"Utilities",data:[
        {name:"AddEvidence",description:"Adds provided entries to the incident Evidence Board. In playbook, can be positioned after a task to add the previous task's entries to Evidence Board automatically (with no need to provide arguments)"},
        {name:"AssignAnalystToInciden",description:"Assign analyst to incident. By default, the analyst is picked randomly from the available users, according to the provided roles (if no roles provided, will fetch all users). Otherwise, the analyst will be picked according to the 'assignBy' arguments. machine-learning: DBot will calculated and decide who is the best analyst for the job. top-user: The user that is most commonly owns this type of incident less-busy-user: The less busy analyst will be picked to be the incident owner. online: The analyst is picked randomly from all online analysts, according to the provided roles (if no roles provided, will fetch all users). current: The user that executed the command"},
        {name:"Base64Encode",description:"Will encode an input using Base64 format."},
        {name:"Base64ListToFile",description:"Converts Base64 file in a list to a binary file and upload to warroom"},
        {name:"CEFParser",description:"Parse CEF data into the context. Please notice that outputs will display only the 7 mandatory fields even if the CEF event includes many other custom or extended fields."},
    ]},
    {name:"Conditions",data:[
        {name:"AreValuesEqual",description:"Check whether the values provided in arguments are equal. If either of the arguments are missing, no is returned."},
        {name:"CheckSenderDomainDistance",description:"Get the string distance for the sender from our domain"},
        {name:"checkValue",description:"Gets a value and return it. This is to be used in playbook conditional tasks - get a value from incident field, label or context, and act accordingly. If an array is returned. the first value will be the decision making value."},
        {name:"ContainsCreditCardInfo",description:"Check if a given value is true. Will return 'no' otherwise"},
        {name:"EmailAskUserResponse",description:"Extract user's response from EmailAskUser reply. Returns the first textual response line of the provided entry that contains the reply body. Use $ {lastCompletedTaskEntries} to analyze the previous playbook task containing the user's reply."}
    ]},
    {name:"CVE Search",data:[
        {name:"cve-search",description:"Search CVE by ID"},
        {name:"cve-latest",description:"Get latest updated CVEs"},
        {name:"cveReputation",description:"Provides severity of CVE based on CVSS score where available"}
    ]},
    {name:"Hybrid Analysis",data:[
        {name:"hybrid-analysis-scan",description:"Get summary information for a given MD5, SHA1 or SHA256 and all the reports generated for any environment ID"},
        {name:"hybrid-analysis-submit-sample",description:"Submit a file from investigation to analysis server (NOTE - minimum required authorization is `default`)"},
        {name:"hybrid-analysis-search",description:"Search the database using the Hybrid Analysis search syntax"},
        {name:"hybrid-analysis-detonate-file",description:"Detonate file through Hybrid Analysis"},
    ]},
    {name:"ipinfo",data:[
        {name:"ip",description:"Check IP reputation (when information is available, returns a JSON with details). Uses all configured Threat Intelligence feeds"},
        {name:"ipinfo_field",description:"Retrieve value for a specific field from the IP address information"}
    ]},
    {name:"OpenPhish",data:[
        {name:"url",description:"Check URL Reputation"},
        {name:"openphish-reload",description:"Reload OpenPhish database"},
        {name:"openphish-status",description:"Show OpenPhish database status"},
        {name:"AnalyzeOSX",description:"Get file and url reputation for osxcollector result. will use VirusTotal for Url checks, and IBM XForce for MD5 checks. maxchecks : for system : system name to run agent on. section : the type check that OSXCollector should run."}
    ]},
    {name:"PhishTank",data:[
        {name:"url",description:"Check URL Reputation"},
        {name:"PhishTank-reload",description:"Reload PhishTank database"},
        {name:"PhishTank-status",description:"Show PhishTank database status"},
        {name:"AnalyzeOSX",description:"Common user defined code that will be merged into each server script"},
    ]},
    {name:"Rasterize",data:[
        {name:"rasterize",description:"Rasterize a URL into image or PDF"},
        {name:"rasterize-email",description:"Rasterize an email body into an image"},
        {name:"rasterize-image",description:"Rasterize an image file"},
    ]},
    {name:"Threat Crowd",data:[
        {name:"threat-crowd-email",description:"Get email report"},
        {name:"threat-crowd-domain",description:"Get domain report"}
    ]},
    {name:"urlscan.io",data:[
        {name:"urlscan-search",description:"Search for an indicator that is related to former urlscan.io scans."},
        {name:"urlscan-submit",description:"Submit a url to scan"},
        {name:"url",description:"Submit a url to scan"},
        {name:"AnalyzeOSX",description:"Common user defined code that will be merged into each server script"},
    ]},
    {name:"Where is the egg?",data:[
        {name:"clue",description:"try me"}
    ]},
    {name:"Whois",data:[
        {name:"whois",description:"Provides registration details about a domain"}
    ]},
    {name:"Builtin Commands",data:[
        {name:"dockerImageUpdate",description:"commands.local.cmd.updateDockerImage"},
        {name:"createNewIndicator",description:"Change the properties of an indicator"}
    ]},
    {name:"Other",data:[
        {name:"ActiveUsersD2",description:"Get active users from a D2 agent and parsed them into context"},
        {name:"ADGetComputer",description:"Use Active Directory to retrieve detailed information about a computer account. The computer can be specified by name, email or as an Active Directory Distinguished Name (DN). If no filters are provided, the result will show all computers."}
    ]},
]