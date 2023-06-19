<?xml version = "1.0" encoding = "UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" /> 

<xsl:template match="/"> 
                <table border="1">
                    <tr>
                        <th>Name</th>
                        <th>Capital</th>
                        <th>Flag</th>
                        <th>Spoken languages</th>
                    </tr>
                        <tr bgcolor="white">
                            <td>
                                <span style="color: green">
                                    <xsl:value-of select="country_name/offic_name"/>
                                </span>
                                <span>
                                    (<xsl:value-of select="country_name/common_name"/>)
                                </span>
                                <span style="color: blue">
                                    <xsl:value-of select="country_name/native_name[@lang='fra']/offic_name"/>
                                </span>
                            </td>
                            <td>
                                <xsl:value-of select="capital"/> 
                            </td>
                            <td>
                                <xsl:for-each select="current()/country_codes/cca2">
                                    <xsl:variable name="lowercaseCca2" select="translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')" />
                                    <img src="http://www.geonames.org/flags/x/{$lowercaseCca2}.gif" alt="" height="40" width="60" />
                                </xsl:for-each>
                            </td>
                            <td>
                                <xsl:for-each select="current()/languages/child::*">
                                    <xsl:value-of select="current()"/>
                                    <xsl:if test="position() != last()">
                                        ,
                                    </xsl:if>
                                </xsl:for-each>
                            </td>
                        </tr>
                </table>
    </xsl:template>

</xsl:stylesheet>