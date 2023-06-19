<?xml version = "1.0" encoding = "UTF-8"?>
<!-- Gabin GARROT, Théo HAURAY -->

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" /> 
    <xsl:param
    name="cca2"
    select="expression">
    </xsl:param> 

<xsl:template match="/"> 
    <xsl:apply-templates select="countries/country[country_codes/cca2=$cca2]"/>

</xsl:template>

<xsl:template match="country"> 
    <table border="1">
        <tr>
            <th>Name</th>
            <th>Capital</th>
            <th>Flag</th>
            <th>Spoken languages</th>
            <th>Monnaie</th>
        </tr>
            <tr bgcolor="white">
                <td> 
                    <span>
                        <xsl:value-of select="country_name/common_name"/>  
                    </span>
                </td>
                <td>
                    <xsl:value-of select="capital"/> 
                </td>
                <td>
                    <xsl:for-each select="country_codes/cca2">
                        <xsl:variable name="lowercaseCca2" select="translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')" />
                        <img src="http://www.geonames.org/flags/x/{$lowercaseCca2}.gif" alt="" height="40" width="60" />
                    </xsl:for-each>
                </td>
                <td>
                    <xsl:for-each select="languages/child::*">
                        <xsl:value-of select="current()"/>
                        <xsl:if test="position() != last()">
                            ,
                        </xsl:if>
                    </xsl:for-each>
                </td>
                <td id="monnaie">
                </td>
            </tr>
    </table> 
</xsl:template>

</xsl:stylesheet>