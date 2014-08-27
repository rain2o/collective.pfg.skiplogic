""" This is just to remind me what I was doing on my first draft.
    This will be removed soon
"""

#d = '{"issue":{"Locked in filenet":[{"Field": "24-hours", "Required":true, "Title": "Has It Been In Filenet for at least 24 hours?"}]}, "days-remaining": {"1": [{"Field": "issue", "Required": true, "Title": "Issue"}]}}'
#context.setSkipLogic(d)
#context.reindexObject()
#skipLogic = context.getSkipLogic()[0]

#sl = context.getSkipLogicJSON()
#return sl

def isIncluded(l, name):
    for d in l:
        if name == d['Field']:
            return d['Required']
    return False


if json:
    return json
if name:
    return isIncluded(includes, name)
