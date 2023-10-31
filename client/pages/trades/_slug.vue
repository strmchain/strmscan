<template>
    <div
        v-if="loading"
        :class="(loading ? 'strm-loading strm-loading--full' : '')"/>
    <section v-else>
        <div class="card strm-card">
            <div class="strm-card__header">
                <h3 class="strm-headline">
                    <span class="mr-2">Trade Hash:</span>
                    <read-more
                        :text="hash"
                        class="d-sm-none"/>
                    <read-more
                        :text="hash"
                        :max-chars="20"
                        class="d-none d-sm-inline-block d-md-none"/>
                    <read-more
                        :text="hash"
                        :max-chars="30"
                        class="d-none d-md-inline-block d-lg-none"/>
                    <read-more
                        :text="hash"
                        :max-chars="40"
                        class="d-none d-lg-inline-block d-2xl-none"/>
                    <span class="d-none d-2xl-inline-block">{{ hash }}</span>
                </h3>
            </div>
            <div class="strm-card__body">
                <table class="strm-card__table">
                    <tbody>
                        <tr>
                            <td>Trade Hash</td>
                            <td>{{ trade.hash }}</td>
                        </tr>
                        <tr>
                            <td>Tx Hash</td>
                            <td>
                                <nuxt-link
                                    :to="{name: 'txs-slug', params: {slug:trade.txHash}}">
                                    {{ trade.txHash }}</nuxt-link>
                            </td>
                        </tr>
                        <tr>
                            <td>Taker address</td>
                            <td>
                                <nuxt-link
                                    :to="{name: 'address-slug',
                                          params: {slug:trade.taker.toLowerCase()}}">
                                    {{ trade.taker.toLowerCase() }}</nuxt-link>
                            </td>
                        </tr>
                        <tr>
                            <td>Taker order</td>
                            <td>
                                <nuxt-link
                                    :to="{name: 'orders-slug',
                                          params: {slug: trade.takerOrderHash.toLowerCase()}}">
                                    {{ trade.takerOrderHash.toLowerCase() }}</nuxt-link>
                            </td>
                        </tr>
                        <tr>
                            <td>Taker exchange</td>
                            <td>
                                <nuxt-link
                                    :to="{name: 'address-slug',
                                          params: {slug: trade.takerExchange.toLowerCase()}}">
                                    {{ trade.takerExchange.toLowerCase() }}</nuxt-link>
                            </td>
                        </tr>
                        <tr>
                            <td>Maker address</td>
                            <td>
                                <nuxt-link
                                    :to="{name: 'address-slug',
                                          params: {slug:trade.maker.toLowerCase()}}">
                                    {{ trade.maker.toLowerCase() }}</nuxt-link>
                            </td>
                        </tr>
                        <tr>
                            <td>Maker order</td>
                            <td>
                                <nuxt-link
                                    :to="{name: 'orders-slug',
                                          params: {slug: trade.makerOrderHash.toLowerCase()}}">
                                    {{ trade.makerOrderHash.toLowerCase() }}</nuxt-link>
                            </td>
                        </tr>
                        <tr>
                            <td>Maker exchange</td>
                            <td>
                                <nuxt-link
                                    :to="{name: 'address-slug',
                                          params: {slug:trade.makerExchange.toLowerCase()}}">
                                    {{ trade.makerExchange.toLowerCase() }}</nuxt-link>
                            </td>
                        </tr>
                        <tr>
                            <td>Pair name</td>
                            <td>
                                <span>
                                    <nuxt-link
                                        v-if="trade.baseToken !== strmNativeToken"
                                        :to="{name: 'tokens-slug',
                                              params: {slug: trade.baseToken}}">
                                        {{ trade.baseSymbol }}</nuxt-link>
                                    <span v-else>
                                        {{ trade.baseSymbol }}</span>/<nuxt-link
                                        v-if="trade.quoteToken !== strmNativeToken"
                                        :to="{name: 'tokens-slug',
                                              params: {slug: trade.quoteToken}}">
                                        {{ trade.quoteSymbol }}</nuxt-link>
                                    <span v-else>{{ trade.quoteSymbol }}</span>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td>Price</td>
                            <td>{{ formatNumber(trade.pricepoint) }}
                                {{ trade.quoteSymbol }}</td>
                        </tr>
                        <tr>
                            <td>Amount</td>
                            <td>{{ formatNumber(trade.amount) }}
                                {{ trade.baseSymbol }}</td>
                        </tr>
                        <tr>
                            <td>Taker Fee</td>
                            <td>{{ formatNumber(trade.takeFee) }}
                                {{ trade.quoteSymbol }}</td>
                        </tr>
                        <tr>
                            <td>Maker Fee</td>
                            <td>{{ formatNumber(trade.makeFee) }}
                                {{ trade.quoteSymbol }}</td>
                        </tr>
                        <tr>
                            <td>Age</td>
                            <td>
                                <span
                                    v-b-tooltip.hover
                                    :title="$moment(trade.createdAt).format('lll')">
                                    {{ $moment(trade.createdAt).fromNow() }}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <b-tabs
            ref="allTabs"
            class="strm-tabs">
            <b-tab
                lazy
                title="Orders"
                href="#orders">
                <table-order :trade-hash="hash"/>
            </b-tab>
        </b-tabs>
    </section>
</template>
<script>
import mixin from '~/plugins/mixin'
import ReadMore from '~/components/ReadMore'
import TableOrder from '~/components/TableOrder'

export default {
    components: {
        TableOrder,
        ReadMore
    },
    mixins: [mixin],
    data () {
        return {
            hash: null,
            trade: {},
            loading: true,
            strmNativeToken: process.env.STRM_NATIVE_TOKEN
        }
    },
    created () {
        this.hash = this.$route.params.slug
    },
    async mounted () {
        try {
            this.loading = true

            // Init breadcrumbs data.
            this.$store.commit('breadcrumb/setItems', {
                name: 'trades-slug',
                to: { name: 'trades-slug', params: { slug: this.hash } }
            })

            const { data } = await this.$axios.get('/api/trades/' + this.hash)

            this.trade = data

            this.loading = false
        } catch (error) {
            console.log(error)
        }
    },
    head () {
        return {
            title: 'Trade ' + this.$route.params.slug + ' detail'
        }
    }
}
</script>
