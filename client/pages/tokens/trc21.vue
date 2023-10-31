<template>
    <div
        v-if="loading"
        :class="(loading ? 'strm-loading strm-loading--full' : '')"/>
    <section v-else>

        <div
            v-if="total == 0"
            class="strm-empty">
            <i class="fa fa-chain-broken strm-empty__icon"/>
            <p class="strm-empty__description">No token found</p>
        </div>

        <p
            v-if="total > 0"
            class="strm-total-items">{{ _nFormatNumber('token', 'tokens', total) }}</p>

        <table-base
            v-if="total > 0"
            :fields="fields"
            :items="items"
            class="strm-table--tokens-nft">

            <template
                slot="hash"
                slot-scope="props">
                <nuxt-link :to="{name: 'tokens-slug', params: {slug: props.item.hash}}">
                    <span class="text-truncate">{{ props.item.hash }}</span>
                </nuxt-link>
            </template>

            <template
                slot="name"
                slot-scope="props">
                <nuxt-link :to="{name: 'tokens-slug', params: {slug: props.item.hash}}">
                    {{ trimWord(props.item.name) }}
                </nuxt-link>
            </template>

            <template
                slot="symbol"
                slot-scope="props">{{ props.item.symbol }}</template>

            <template
                slot="totalSupply"
                slot-scope="props">{{ formatNumber(props.item.totalSupplyNumber) }} {{ props.item.symbol }}</template>

        </table-base>

        <b-pagination
            v-if="total > 0 && total > perPage"
            v-model="currentPage"
            :total-rows="pages * perPage"
            :per-page="perPage"
            :number-of-pages="pages"
            :limit="7"
            align="center"
            class="strm-pagination"
            @change="onChangePaginate"/>
    </section>
</template>
<script>
import mixin from '~/plugins/mixin'
import TableBase from '~/components/TableBase'

export default {
    components: {
        TableBase
    },
    mixins: [mixin],
    data: () => ({
        fields: {
            hash: { label: 'Hash' },
            name: { label: 'Name' },
            symbol: { label: 'Symbol' },
            totalSupply: { label: 'Total Supply' }
        },
        loading: true,
        total: 0,
        items: [],
        currentPage: 1,
        perPage: 20,
        pages: 1
    }),
    mounted () {
        // Init breadcrumbs data.
        this.$store.commit('breadcrumb/setItems', {
            name: 'tokens-trc21',
            to: { name: 'tokens-trc21' }
        })

        this.getDataFromApi()
    },
    methods: {
        async getDataFromApi () {
            const self = this

            // Show loading.
            self.loading = true

            const params = {
                page: self.currentPage,
                limit: self.perPage,
                type: 'trc21'
            }

            const query = this.serializeQuery(params)
            const { data } = await this.$axios.get('/api/tokens' + '?' + query)
            self.items = data.items
            self.total = data.total
            self.pages = data.pages

            // Hide loading.
            self.loading = false

            return data
        },
        onChangePaginate (page) {
            this.currentPage = page
            this.getDataFromApi()
        }
    },
    head: () => ({
        title: 'Trc21 Token'
    })
}
</script>
