from Products.Archetypes.public import BooleanField, BooleanWidget
from archetypes.schemaextender.field import ExtensionField

from zope.component import adapts
from zope.interface import implements
from archetypes.schemaextender.interfaces import ISchemaExtender
from Products.ATContentTypes.interface import IATDocument
from Products.PloneFormGen.interfaces.form import IPloneFormGenForm


class SkipLogicBooleanField(ExtensionField, BooleanField):
    """ boolean field to enable/disable skip logic on PFG """


class PFGExtender(object):
    adapts(IPloneFormGenForm)
    implements(ISchemaExtender)


    fields = [
        SkipLogicBooleanField("skip_logic",
            widget = BooleanWidget(
                label="Skip Logic", 
                description="Enable Skip Logic on this form?"
                )
            ),
        ]


    def __init__(self, context):
        self.context = context

    def getFields(self):
        return self.fields

