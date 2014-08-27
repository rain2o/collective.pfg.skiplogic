from Products.Archetypes.public import BooleanField, BooleanWidget
from archetypes.schemaextender.field import ExtensionField

from zope.component import adapts
from zope.interface import implements
from archetypes.schemaextender.interfaces import ISchemaExtender
from Products.ATContentTypes.interface import IATDocument
from Products.PloneFormGen.interfaces.form import IPloneFormGenForm

import json

class SkipLogicBooleanField(ExtensionField, BooleanField):
    """ boolean field to enable/disable skip logic on PFG """


class PFGExtender(object):
    adapts(IPloneFormGenForm)
    implements(ISchemaExtender)


    fields = [
        SkipLogicBooleanField("skipLogicEnabled",
            widget = BooleanWidget(
                label="Skip Logic", 
                description="Enable Skip Logic on this form?"
                )
            ),
    """
    Storing this here for future reference.         
        LinesField(
            name='skipLogic',
            required=False,
            widget=atapi.StringWidget(
                label='SKip Logic',
                description='create skip logic',
                visible = {"edit": "invisible", "view": "invisible"},
            ),
            searcable=False,
            schemata='default',
        ),
    """
        ]


    def __init__(self, context):
        self.context = context

    def getFields(self):
        return self.fields

    """ 
    And this 
    def getSkipLogicJSON(self):
        sl = self.getSkipLogic()
        if len(sl)>0:
            return json.loads(sl[0])
    """